import React from 'react';

export default React.createContext({
    inProgress: false,
    startProgress: () => { },
    endProgress: () => { },
});