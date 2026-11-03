const fs = require('node:fs');
const path = require('node:path');
const ResEdit = require('resedit');

// Edit the Windows resources without requiring Wine on a macOS build host.
module.exports = async function afterPack(context) {
  if (context.electronPlatformName !== 'win32') return;
  const destination = path.join(context.appOutDir, 'PromptStudio.exe');
  const executable = ResEdit.NtExecutable.from(fs.readFileSync(destination), { ignoreCert: true });
  const resources = ResEdit.NtExecutableResource.from(executable);
  const icons = ResEdit.Data.IconFile.from(fs.readFileSync(path.join(__dirname, 'icons/app-icon.ico'))).icons.map(item => item.data);
  const groups = ResEdit.Resource.IconGroupEntry.fromEntries(resources.entries);
  for (const group of groups) ResEdit.Resource.IconGroupEntry.replaceIconsForResource(resources.entries, group.id, group.lang, icons);
  const [major, minor, patch] = context.packager.appInfo.version.split('.').map(part => Number.parseInt(part, 10));
  for (const version of ResEdit.Resource.VersionInfo.fromEntries(resources.entries)) {
    for (const language of version.getAllLanguagesForStringValues()) {
      version.setStringValues(language, {
        FileDescription: 'Prompt Studio', ProductName: 'Prompt Studio',
        OriginalFilename: 'PromptStudio.exe', InternalName: 'PromptStudio',
      });
    }
    version.setFileVersion(major, minor, patch, 0);
    version.setProductVersion(major, minor, patch, 0);
    version.outputToResourceEntries(resources.entries);
  }
  resources.outputResource(executable);
  const temporary = destination + '.branding';
  fs.writeFileSync(temporary, Buffer.from(executable.generate()));
  fs.renameSync(temporary, destination);
};
