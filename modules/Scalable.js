export default class Scalable extends Draggable{
    _onResizeMouseDown(event) {
        event.preventDefault();
    
        // Limit dragging to 60 updates per second
        const now = Date.now();
        if ( (now - this._moveTime) < (1000/60) ) return;
        this._moveTime = now;
    
        // Record initial position
        this.position = duplicate(this.app.position);
        if ( this.position.height === "auto" ) this.position.height = this.element.clientHeight;
        if ( this.position.width === "auto" ) this.position.width = this.element.clientWidth;
        if( this.position.scale === null ) this.position.scale = 1;
        const widthMax = window.innerWidth - this.position.left;
        const heightMax = window.innerHeight - this.position.top;
        this._initial = {x: event.clientX, y: event.clientY, scaleMax: Math.min(widthMax/this.position.width, heightMax/this.position.height) };

        // Add temporary handlers
        window.addEventListener(...this.handlers.resizeMove);
        window.addEventListener(...this.handlers.resizeUp);
      }
    
      _onResizeMouseMove(event) {
        event.preventDefault();
        const widthChange = this.position.width + event.clientX - this._initial.x;
        const heightChange = this.position.height + event.clientY - this._initial.y;
        const xScale = (widthChange / 716)*this.position.scale;
        const yScale = (heightChange / 125)*this.position.scale;

        this.app.setPosition({
          scale: Math.clamped(1, Math.max(xScale, yScale), this._initial.scaleMax)
        });
      }
}