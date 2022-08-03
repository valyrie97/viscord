import useHover from "../hooks/useHover";

export function BigButton(props: any) {
  const [ref, hover] = useHover<HTMLDivElement>();

  const angle = props.angle ?? 20;
  const width = props.width ?? 'auto';
  const display = !!props.inline ? 'inline-grid' : 'grid';

  return (
    <div ref={ref} onClick={props.onClick ?? (() => { })} style={{
      cursor: 'pointer',
      width: width,
      // margin: '4px',
      display: display,
      padding: '8px',
      borderRadius: '8px',
      gridAutoFlow: 'column',
      gridTemplateColumns: 'min-content 1fr',
      background: (!!props.bright) ? (
        props.selected ? 'var(--neutral-6)' :
                 hover ? 'var(--neutral-6)' :
                         'var(--neutral-5)'
      ) : (
        props.selected ? 'var(--neutral-5)' :
                 hover ? 'var(--neutral-4)' :
                         'inherit'
      ),
      transform: `skew(-${angle}deg, 0deg)`,
      boxSizing: 'border-box',
    }}>
      <div style={{
        padding: '4px',
        display: 'flex',
        transform: `skew(${angle}deg, 0deg)`,
      }}>
        {props.icon({
          size: 16,
          color: !!props.color ? props.color : (!!props.bright) ? (
            props.selected ? 'var(--neutral-9)' :
                     hover ? 'var(--neutral-8)' :
                             'var(--neutral-8)'
          ) : (
            props.selected ? 'var(--neutral-9)' :
                     hover ? 'var(--neutral-7)' :
                             'var(--neutral-7)'
          ),
        })}
      </div>

      <span style={{
        lineHeight: '24px',
        paddingLeft: '4px',
        paddingRight: '4px',
        color: !!props.color ? props.color : (!!props.bright) ? (
          props.selected ? 'var(--neutral-9)' :
                   hover ? 'var(--neutral-9)' :
                           'var(--neutral-9)'
        ) : (
          props.selected ? 'var(--neutral-9)' :
                   hover ? 'var(--neutral-9)' :
                           'var(--neutral-7)'
        ),
        transform: `skew(${angle}deg, 0deg)`,
      }}>
        {props.text}
      </span>
    </div>
  );
}
