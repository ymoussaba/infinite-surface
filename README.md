# Infinite-Surface
container with pan and zoom for [React](http://facebook.github.io/react/). 

## Installation

infinite-surface is available as an [npm package](https://www.npmjs.org/package/infinite-surface).

```sh
npm install infinite-surface
```

## Example
[https://dht.github.io/infinite-surfuce](https://dht.github.io/infinite-surfuce)

## Usage

Here is a quick example to get you started:

**Import**
```jsx
 import InfiniteSurface from 'infinite-surfuce/InfiniteSurface';
 
 /* for file drop support: */ 
 
 import InfiniteSurfaceWithDrop from 'infinite-surfuce/InfiniteSurfaceWithDrop';
```

**Regular**
```jsx 
<InfiniteSurface backgroundColor="#f3f3f3">
    <div id="phone" style={{backgroundColor:'white', width:'450px', height: '600px', padding:'30px'}}>
        <p>
            <strong>to pan:</strong> hold "space" and move cursor
        </p>
        <p>
            <strong>to zoom:</strong> hold "z" and click
        </p>
        <p>
            <strong>to zoom out:</strong> hold "z" and right click or hold "alt+z" and click
        </p>
    </div>
</InfiniteSurface>
```

**With file drop**
```jsx 
<InfiniteSurfaceWithDrop backgroundColor="#f3f3f3"
    imageDrop={(data)=>console.log(data)}>
    <div id="phone" style={{backgroundColor:'white', width:'450px', height: '600px', padding:'30px'}}>
        <p>
            drop files here
        </p>
    </div>
</InfiniteSurfaceWithDrop>
```

**Complete property**
```jsx 
 <InfiniteSurface
    backgroundColor="#f3f3f3"
    startingPosition={{x: 100, y: 100, zoom: 1.0}}
    modeMoveEnter={() => console.log('modeMoveEnter')}
    modeZoomEnter={() => console.log('modeZoomEnter')}
    modeCleared={() => console.log('modeCleared')}
    setZoom={(zoom) => console.log('setZoom = ' + zoom)}
    didZoom={() => console.log('didZoom')}
    willZoom={() => console.log('willZoom')}
    imageDrop={(data)=>console.log(data)}
    refreshSelector={() => this.log('refreshSelector')}
    overlay={{
                 url: 'http://lorempixel.com/320/568',
                 width: 380,
                 height: 568,
                 left: 0,
                 top: 0,
                 opacity: 0.1,
                 show: true
             }}>
    <div className="phone" id="phone">
        <p>
            <strong>to pan:</strong> space + click and drag 
        </p>
        <p>
            <strong>to zoom:</strong> hold "z" and click
        </p>
        <p>
            <strong>to zoom out:</strong> hold "z" and right click or hold "alt+z" and click
        </p>
    </div>
    </InfiniteSurface>
```
## Contribution
To run locally install all the dependencies:

dev:
```sh
npm install
```

peer:
```sh
npm install react@^15.4.1 react-dom@^15.4.1
```

run with npm:
```sh
npm start
```

first test was added as a starting point:
```sh
npm test
```
We need to understand how to trigger long key presses and mouse moves in **enzyme** to further test this component. 
Any contributions are welcomed. 


## License
This project is licensed under the terms of the MIT license
