// Ambient animated gradient "liquid" background — sits fixed behind every page,
// three large blurred blobs slowly drifting/scaling on independent, non-synced
// loops so the motion reads as organic rather than mechanical.
export default function LiquidBackground() {
  return (
    <div className="liquid-bg" aria-hidden="true">
      <div className="liquid-blob liquid-blob-a" />
      <div className="liquid-blob liquid-blob-b" />
      <div className="liquid-blob liquid-blob-c" />
    </div>
  )
}
