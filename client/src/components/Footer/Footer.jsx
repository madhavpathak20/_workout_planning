// components/footer/Footer.jsx

import React from 'react'

const Footer = () => {
    return (
        <div className='footer' style={{
            'display': "flex",
            "alignItems": "center",
            "justifyContent": "center",
            "height": "100px",
            "backgroundColor": "#BE3144",
            "color": "white",
            "fontWeight": "800"
        }}>
            <p>ShapeSync by Madhav</p>
        </div>
    )
}

export default Footer