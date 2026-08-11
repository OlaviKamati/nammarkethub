const INPUT = {
  width: '100%',
  padding: '9px 12px',
  fontSize: 13,
  background: 'var(--black-card)',
  border: '1px solid var(--black-border)',
  borderRadius: 8,
  color: 'var(--white)',
  outline: 'none',
}

// options: [{ name: 'Color', values: ['Red', 'Blue'] }, ...]
// Values are edited as a comma-separated string for simplicity.
export default function ProductOptionsEditor({ options, onChange }) {
  function updateGroup(index, patch) {
    onChange(options.map((g, i) => (i === index ? { ...g, ...patch } : g)))
  }

  function addGroup() {
    onChange([...options, { name: '', values: [] }])
  }

  function removeGroup(index) {
    onChange(options.filter((_, i) => i !== index))
  }

  return (
    <div>
      <label style={{ fontSize: 11, color: 'var(--white-dim)', display: 'block', marginBottom: 6 }}>
        Options (e.g. Color, Size, Flavour) - optional
      </label>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {options.map((group, i) => (
          <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <input
              value={group.name}
              onChange={(e) => updateGroup(i, { name: e.target.value })}
              placeholder="Option name (e.g. Color)"
              style={{ ...INPUT, flex: '0 0 140px' }}
            />
            <input
              value={group.values.join(', ')}
              onChange={(e) => updateGroup(i, { values: e.target.value.split(',').map((v) => v.trim()).filter(Boolean) })}
              placeholder="Values, comma separated (e.g. Red, Blue, Green)"
              style={{ ...INPUT, flex: 1 }}
            />
            <button type="button" onClick={() => removeGroup(i)}
              style={{ fontSize: 12, color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', flexShrink: 0 }}>
              Remove
            </button>
          </div>
        ))}
      </div>
      <button type="button" onClick={addGroup}
        style={{ fontSize: 12, color: 'var(--gold-ink)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginTop: 8 }}>
        + Add option group
      </button>
    </div>
  )
}
