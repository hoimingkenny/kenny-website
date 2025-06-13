import React from 'react';
import Highlight from './Highlight';

// Blue: #6fb5cf, orange: #fd6947, gold: #fcc037, mild green: #a7ce5b, violet: #d0b8f1
export default function Term({children}) {
    return <Highlight bgColor="#6fb5cf" fontWeight="700">{children}</Highlight>
}