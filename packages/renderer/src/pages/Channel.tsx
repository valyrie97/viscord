import { CgHashtag } from "react-icons/cg";
import useChannel from "../hooks/useChannel";
import useHover from "../hooks/useHover";

interface ChannelProps {
  unread: number;
  uid: string;
  name: string;
}

export default function Channel(props: ChannelProps) {
  const { channel, setChannel } = useChannel();
  const { unread, uid, name } = props;
  const [ref, hover] = useHover<HTMLDivElement>();
  const selected = channel === uid;

  return (
    <div
      style={{
        margin: '2px 2px',
        display: 'grid',
        gridTemplateColumns: 'min-content 1fr',
        color: selected ? 'cyan' : 'inherit',
        cursor: 'pointer',
        background: selected ? 'var(--neutral-4)' :
                       hover ? 'var(--neutral-3)' :
                               'inherit',
        borderRadius: '8px',
        // placeItems: 'left center',
        // border: '1px solid white'
      }}
      onClick={() => {
        setChannel(uid);
      }}
      ref={ref}
    >
      <CgHashtag color={
          selected ? 'var(--neutral-9)' :
             hover ? 'var(--neutral-7)' :
                     'var(--neutral-7)'
        } size={24} style={{
        margin: '4px',
      }}></CgHashtag>
      <div style={{
        lineHeight: '32px',
        color: selected ? 'var(--neutral-9)' :
                  hover ? 'var(--neutral-9)' :
                          'var(--neutral-7)'
      }}>
        {name.toLowerCase().replaceAll(' ', '-').trim()}
      </div>
      {/* {(unread > 0) && (
        <span style={{ paddingRight: '8px' }}>({unread})</span>
      )}
      <span style={{
        fontWeight: (unread ?? 0) > 0 ? 'bold' : '300',
      }}>
        {name}
      </span>
      <a style={{
        color: 'rgba(0, 100, 200, 1)',
        marginLeft: '8px',
        fontSize: '10px',
      }} href="#" onClick={() => {}}>Delete</a> */}
    </div>
  )
}