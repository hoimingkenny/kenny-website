import React from 'react';

export default function Highlight({children, bgColor="#000000", fontColor="#ffffff",fontWeight=700, textAlign='center', padding="0.1rem", margin="0.05rem", border="0", borderRadius="0.5rem", display="inline-block"}) {
    return (
      <div
        style={{
          backgroundColor: bgColor,          
          padding: padding,
          paddingLeft: '0.4rem',
          paddingRight: '0.4rem',
          margin: margin,
          marginLeft: '0.05rem',
          marginRight: '0.05rem',
          display: display,
          fontWeight: fontWeight,
          color: fontColor,
          textAlign: textAlign,
          border: border,
          borderRadius: borderRadius,
          minWidth: '1.8rem',                 
        }}>
        {children}
      </div>
    );
  }