export const ProjectGrid = {
  extends: 'Flex',
  flow: 'y',
  padding: 'F C',
  gap: 'D',

  FilterRow: {
    extends: 'Flex',
    flexAlign: 'center flex-start',
    gap: 'Z',
    children: (el, s) => s.root.filters,
    childExtends: 'FilterBtn',
    childrenAs: 'state'
  },

  Grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: 'B',
    children: (el, s) => s.root.activeFilter === 'all'
      ? s.root.projects
      : s.root.projects.filter(p => p.category === s.root.activeFilter),
    childExtends: 'ProjectCard',
    childrenAs: 'state'
  }
}

export const FilterBtn = {
  tag: 'button',
  text: (el, s) => s.label,
  padding: 'Z B',
  borderRadius: 'D',
  border: 'none',
  cursor: 'pointer',
  fontSize: 'Z1',
  fontWeight: '500',
  transition: 'all 0.15s',
  background: (el, s) => s.root.activeFilter === s.id ? 'filterActiveBg' : 'tagBg',
  color: (el, s) => s.root.activeFilter === s.id ? 'filterActiveText' : 'textSecondary',
  onClick: (e, el, s) => { s.root.activeFilter = s.id }
}

export const ProjectCard = {
  extends: 'Flex',
  flow: 'y',
  gap: 'B',
  cursor: 'pointer',
  borderRadius: 'B',
  overflow: 'hidden',
  transition: 'transform 0.3s',
  ':hover': { transform: 'translateY(-4px)' },

  ImageWrap: {
    position: 'relative',
    height: '280px',
    overflow: 'hidden',
    borderRadius: 'B',
    background: 'cardBg',

    Img: {
      tag: 'img',
      src: (el, s) => s.image,
      alt: (el, s) => s.title,
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      transition: 'transform 0.4s',
      ':hover': { transform: 'scale(1.04)' }
    },

    Overlay: {
      position: 'absolute',
      inset: '0',
      background: 'hoverOverlay',
      opacity: '0',
      transition: 'opacity 0.3s',
      flexAlign: 'center center',
      ':hover': { opacity: '1' },
      ViewLabel: {
        extends: 'Text', tag: 'span',
        text: 'View Project →',
        color: 'white', fontSize: 'B', fontWeight: '600'
      }
    }
  },

  Info: {
    extends: 'Flex',
    flow: 'y',
    gap: 'Z',
    padding: 'Z 0',

    TopRow: {
      extends: 'Flex',
      flexAlign: 'center space-between',
      Title: { tag: 'h3', text: (el, s) => s.title, color: 'textPrimary', fontSize: 'B1', fontWeight: '600' },
      Year: { extends: 'Text', tag: 'span', text: (el, s) => s.year, color: 'textMuted', fontSize: 'Z1' }
    },

    Desc: { tag: 'p', text: (el, s) => s.desc, color: 'textSecondary', fontSize: 'Z1', lineHeight: '1.6' },

    Tags: {
      extends: 'Flex',
      flexAlign: 'center flex-start',
      gap: 'Z',
      flexWrap: 'wrap',
      children: (el, s) => (s.tags || []).map(t => ({ label: t })),
      childExtends: 'ProjectTag',
      childrenAs: 'state'
    }
  }
}

export const ProjectTag = {
  tag: 'span',
  text: (el, s) => s.label,
  background: 'tagBg',
  color: 'tagText',
  padding: 'X Z',
  borderRadius: 'X',
  fontSize: '11px',
  fontWeight: '500'
}
