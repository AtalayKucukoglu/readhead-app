import React from 'react'

export default function RoundedImage(props) {

  const defaultSize = 50
  const styles = { 
    wrapper: {
      display: 'flex',
      height: props.height || defaultSize,
      width: props.height ? 'auto' : defaultSize,
      cursor: 'pointer',
    },
    image: {
      objectFit: 'cover',
      alignSelf: 'center',
      height: 'inherit',
      width: props.height ? 'auto' : '100%',
      borderRadius: props.height || defaultSize
    }
  }

  return (
    <div style={styles.wrapper} onClick={props.onClick || null}>
      <img style={styles.image} src={props.src} alt={props.alt} />
    </div>
  )
}

