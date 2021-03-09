(function (root) {
    function Index(len) {
        this.index = 0;   
        this.len = len;  
    }
    Index.prototype = {
       
        prev:function() {
            return this.get(-1);    
        },

        next:function() {
            return this.get(1);    
        },

        get:function(val) {
            this.index = (this.index + val + this.len) % this.len;
            return this.index;
        }
    }

    root.controlIndex=Index;   
})(window.player || (window.player = {}));