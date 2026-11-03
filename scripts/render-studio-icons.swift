import AppKit
import Foundation
let root = CommandLine.arguments[1]
func render(_ size: Int, _ relative: String, maskable: Bool = false) {
    let rep = NSBitmapImageRep(bitmapDataPlanes: nil, pixelsWide: size, pixelsHigh: size, bitsPerSample: 8, samplesPerPixel: 4, hasAlpha: true, isPlanar: false, colorSpaceName: .deviceRGB, bytesPerRow: 0, bitsPerPixel: 0)!
    NSGraphicsContext.saveGraphicsState()
    NSGraphicsContext.current = NSGraphicsContext(bitmapImageRep: rep)
    let ctx = NSGraphicsContext.current!.cgContext
    ctx.scaleBy(x: CGFloat(size)/32, y: CGFloat(size)/32)
    ctx.translateBy(x: 0, y: 32)
    ctx.scaleBy(x: 1, y: -1)
    ctx.setFillColor(CGColor(gray: 32.0/255, alpha: 1))
    ctx.addPath(CGPath(roundedRect: CGRect(x: 0, y: 0, width: 32, height: 32), cornerWidth: maskable ? 0 : 10, cornerHeight: maskable ? 0 : 10, transform: nil))
    ctx.fillPath()
    ctx.setStrokeColor(CGColor(gray: 1, alpha: 1))
    ctx.setLineWidth(2)
    ctx.setLineCap(.round)
    ctx.setLineJoin(.round)
    ctx.move(to: CGPoint(x:10,y:23)); ctx.addLine(to: CGPoint(x:10,y:9)); ctx.addLine(to: CGPoint(x:17,y:9))
    ctx.addCurve(to: CGPoint(x:22,y:14), control1: CGPoint(x:19.7614,y:9), control2: CGPoint(x:22,y:11.2386))
    ctx.addCurve(to: CGPoint(x:17,y:19), control1: CGPoint(x:22,y:16.7614), control2: CGPoint(x:19.7614,y:19))
    ctx.addLine(to: CGPoint(x:14,y:19)); ctx.strokePath()
    ctx.setFillColor(CGColor(gray: 1, alpha: 1)); ctx.fillEllipse(in: CGRect(x:19.8,y:21.8,width:2.4,height:2.4))
    NSGraphicsContext.restoreGraphicsState()
    try! rep.representation(using: .png, properties: [:])!.write(to: URL(fileURLWithPath:root + "/" + relative))
}
for size in [16, 24, 32, 48, 64, 128, 256, 512, 1024] { render(size, "\(size)x\(size).png") }
render(1024, "app-icon.png")
