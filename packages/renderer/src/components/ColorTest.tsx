


export function ColorTest() {
  return (
    <div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(9, 1fr)'
      }}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => (
          <div key={n} style={{
            background: `var(--neutral-${n})`,
            width: '100%',
            height: '32px',
            display: 'inline-block'
          }}></div>
        ))}
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)'
      }}>
        {['green','orange','cyan','pink','purple','red','yellow'].map((c) => (
          <div key={c} style={{
            backgroundColor: `var(--${c})`,
            width: '100%',
            height: '32px',
            display: 'inline-block'
          }}></div>
        ))}
      </div>
    </div>
  );
}