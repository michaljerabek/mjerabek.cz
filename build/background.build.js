/*! Full Tilt v0.7 / http://github.com/richtr/Full-Tilt */
!function(a){function b(a){return a=+a,0===a||isNaN(a)?a:a>0?1:-1}function c(a){var b=new Promise(function(b,c){var d=function(e){setTimeout(function(){a&&a.data?b():e>=20?c():d(++e)},50)};d(0)});return b}function d(){o=n?(a.screen.orientation.angle||0)*j:(a.orientation||0)*j}function e(a){l.orientation.data=a;for(var b in l.orientation.callbacks)l.orientation.callbacks[b].call(this)}function f(a){l.motion.data=a;for(var b in l.motion.callbacks)l.motion.callbacks[b].call(this)}if(void 0===a.FULLTILT||null===a.FULLTILT){var g=Math.PI,h=g/2,i=2*g,j=g/180,k=180/g,l={orientation:{active:!1,callbacks:[],data:void 0},motion:{active:!1,callbacks:[],data:void 0}},m=!1,n=a.screen&&a.screen.orientation&&void 0!==a.screen.orientation.angle&&null!==a.screen.orientation.angle?!0:!1,o=(n?a.screen.orientation.angle:a.orientation||0)*j,p=h,q=g,r=i/3,s=-h,t={};t.version="0.5.3",t.getDeviceOrientation=function(a){var b=new Promise(function(b,d){var e=new t.DeviceOrientation(a);e.start();var f=new c(l.orientation);f.then(function(){b(e)})["catch"](function(){e.stop(),d("DeviceOrientation is not supported")})});return b},t.getDeviceMotion=function(a){var b=new Promise(function(b,d){var e=new t.DeviceMotion(a);e.start();var f=new c(l.motion);f.then(function(){b(e)})["catch"](function(){e.stop(),d("DeviceMotion is not supported")})});return b},t.Quaternion=function(a,c,d,e){var f;this.set=function(a,b,c,d){this.x=a||0,this.y=b||0,this.z=c||0,this.w=d||1},this.copy=function(a){this.x=a.x,this.y=a.y,this.z=a.z,this.w=a.w},this.setFromEuler=function(){var a,b,c,d,e,f,g,h,i,k,l,m;return function(n){return n=n||{},c=(n.alpha||0)*j,a=(n.beta||0)*j,b=(n.gamma||0)*j,f=c/2,d=a/2,e=b/2,g=Math.cos(d),h=Math.cos(e),i=Math.cos(f),k=Math.sin(d),l=Math.sin(e),m=Math.sin(f),this.set(k*h*i-g*l*m,g*l*i+k*h*m,g*h*m+k*l*i,g*h*i-k*l*m),this.normalize(),this}}(),this.setFromRotationMatrix=function(){var a;return function(c){return a=c.elements,this.set(.5*Math.sqrt(1+a[0]-a[4]-a[8])*b(a[7]-a[5]),.5*Math.sqrt(1-a[0]+a[4]-a[8])*b(a[2]-a[6]),.5*Math.sqrt(1-a[0]-a[4]+a[8])*b(a[3]-a[1]),.5*Math.sqrt(1+a[0]+a[4]+a[8])),this}}(),this.multiply=function(a){return f=t.Quaternion.prototype.multiplyQuaternions(this,a),this.copy(f),this},this.rotateX=function(a){return f=t.Quaternion.prototype.rotateByAxisAngle(this,[1,0,0],a),this.copy(f),this},this.rotateY=function(a){return f=t.Quaternion.prototype.rotateByAxisAngle(this,[0,1,0],a),this.copy(f),this},this.rotateZ=function(a){return f=t.Quaternion.prototype.rotateByAxisAngle(this,[0,0,1],a),this.copy(f),this},this.normalize=function(){return t.Quaternion.prototype.normalize(this)},this.set(a,c,d,e)},t.Quaternion.prototype={constructor:t.Quaternion,multiplyQuaternions:function(){var a=new t.Quaternion;return function(b,c){var d=b.x,e=b.y,f=b.z,g=b.w,h=c.x,i=c.y,j=c.z,k=c.w;return a.set(d*k+g*h+e*j-f*i,e*k+g*i+f*h-d*j,f*k+g*j+d*i-e*h,g*k-d*h-e*i-f*j),a}}(),normalize:function(a){var b=Math.sqrt(a.x*a.x+a.y*a.y+a.z*a.z+a.w*a.w);return 0===b?(a.x=0,a.y=0,a.z=0,a.w=1):(b=1/b,a.x*=b,a.y*=b,a.z*=b,a.w*=b),a},rotateByAxisAngle:function(){var a,b,c=new t.Quaternion,d=new t.Quaternion;return function(e,f,g){return a=(g||0)/2,b=Math.sin(a),d.set((f[0]||0)*b,(f[1]||0)*b,(f[2]||0)*b,Math.cos(a)),c=t.Quaternion.prototype.multiplyQuaternions(e,d),t.Quaternion.prototype.normalize(c)}}()},t.RotationMatrix=function(a,b,c,d,e,f,g,h,i){var k;this.elements=new Float32Array(9),this.identity=function(){return this.set(1,0,0,0,1,0,0,0,1),this},this.set=function(a,b,c,d,e,f,g,h,i){this.elements[0]=a||1,this.elements[1]=b||0,this.elements[2]=c||0,this.elements[3]=d||0,this.elements[4]=e||1,this.elements[5]=f||0,this.elements[6]=g||0,this.elements[7]=h||0,this.elements[8]=i||1},this.copy=function(a){this.elements[0]=a.elements[0],this.elements[1]=a.elements[1],this.elements[2]=a.elements[2],this.elements[3]=a.elements[3],this.elements[4]=a.elements[4],this.elements[5]=a.elements[5],this.elements[6]=a.elements[6],this.elements[7]=a.elements[7],this.elements[8]=a.elements[8]},this.setFromEuler=function(){var a,b,c,d,e,f,g,h,i;return function(k){return k=k||{},c=(k.alpha||0)*j,a=(k.beta||0)*j,b=(k.gamma||0)*j,d=Math.cos(a),e=Math.cos(b),f=Math.cos(c),g=Math.sin(a),h=Math.sin(b),i=Math.sin(c),this.set(f*e-i*g*h,-d*i,e*i*g+f*h,e*i+f*g*h,f*d,i*h-f*e*g,-d*h,g,d*e),this.normalize(),this}}(),this.setFromQuaternion=function(){var a,b,c,d;return function(e){return a=e.w*e.w,b=e.x*e.x,c=e.y*e.y,d=e.z*e.z,this.set(a+b-c-d,2*(e.x*e.y-e.w*e.z),2*(e.x*e.z+e.w*e.y),2*(e.x*e.y+e.w*e.z),a-b+c-d,2*(e.y*e.z-e.w*e.x),2*(e.x*e.z-e.w*e.y),2*(e.y*e.z+e.w*e.x),a-b-c+d),this}}(),this.multiply=function(a){return k=t.RotationMatrix.prototype.multiplyMatrices(this,a),this.copy(k),this},this.rotateX=function(a){return k=t.RotationMatrix.prototype.rotateByAxisAngle(this,[1,0,0],a),this.copy(k),this},this.rotateY=function(a){return k=t.RotationMatrix.prototype.rotateByAxisAngle(this,[0,1,0],a),this.copy(k),this},this.rotateZ=function(a){return k=t.RotationMatrix.prototype.rotateByAxisAngle(this,[0,0,1],a),this.copy(k),this},this.normalize=function(){return t.RotationMatrix.prototype.normalize(this)},this.set(a,b,c,d,e,f,g,h,i)},t.RotationMatrix.prototype={constructor:t.RotationMatrix,multiplyMatrices:function(){var a,b,c=new t.RotationMatrix;return function(d,e){return a=d.elements,b=e.elements,c.set(a[0]*b[0]+a[1]*b[3]+a[2]*b[6],a[0]*b[1]+a[1]*b[4]+a[2]*b[7],a[0]*b[2]+a[1]*b[5]+a[2]*b[8],a[3]*b[0]+a[4]*b[3]+a[5]*b[6],a[3]*b[1]+a[4]*b[4]+a[5]*b[7],a[3]*b[2]+a[4]*b[5]+a[5]*b[8],a[6]*b[0]+a[7]*b[3]+a[8]*b[6],a[6]*b[1]+a[7]*b[4]+a[8]*b[7],a[6]*b[2]+a[7]*b[5]+a[8]*b[8]),c}}(),normalize:function(a){var b=a.elements,c=b[0]*b[4]*b[8]-b[0]*b[5]*b[7]-b[1]*b[3]*b[8]+b[1]*b[5]*b[6]+b[2]*b[3]*b[7]-b[2]*b[4]*b[6];return b[0]/=c,b[1]/=c,b[2]/=c,b[3]/=c,b[4]/=c,b[5]/=c,b[6]/=c,b[7]/=c,b[8]/=c,a.elements=b,a},rotateByAxisAngle:function(){var a,b,c=new t.RotationMatrix,d=new t.RotationMatrix,e=!1;return function(f,g,h){return d.identity(),e=!1,a=Math.sin(h),b=Math.cos(h),1===g[0]&&0===g[1]&&0===g[2]?(e=!0,d.elements[4]=b,d.elements[5]=-a,d.elements[7]=a,d.elements[8]=b):1===g[1]&&0===g[0]&&0===g[2]?(e=!0,d.elements[0]=b,d.elements[2]=a,d.elements[6]=-a,d.elements[8]=b):1===g[2]&&0===g[0]&&0===g[1]&&(e=!0,d.elements[0]=b,d.elements[1]=-a,d.elements[3]=a,d.elements[4]=b),e?(c=t.RotationMatrix.prototype.multiplyMatrices(f,d),c=t.RotationMatrix.prototype.normalize(c)):c=f,c}}()},t.Euler=function(a,b,c){this.set=function(a,b,c){this.alpha=a||0,this.beta=b||0,this.gamma=c||0},this.copy=function(a){this.alpha=a.alpha,this.beta=a.beta,this.gamma=a.gamma},this.setFromRotationMatrix=function(){var a,b,c,d;return function(e){a=e.elements,a[8]>0?(b=Math.atan2(-a[1],a[4]),c=Math.asin(a[7]),d=Math.atan2(-a[6],a[8])):a[8]<0?(b=Math.atan2(a[1],-a[4]),c=-Math.asin(a[7]),c+=c>=0?-g:g,d=Math.atan2(a[6],-a[8])):a[6]>0?(b=Math.atan2(-a[1],a[4]),c=Math.asin(a[7]),d=-h):a[6]<0?(b=Math.atan2(a[1],-a[4]),c=-Math.asin(a[7]),c+=c>=0?-g:g,d=-h):(b=Math.atan2(a[3],a[0]),c=a[7]>0?h:-h,d=0),0>b&&(b+=i),b*=k,c*=k,d*=k,this.set(b,c,d)}}(),this.setFromQuaternion=function(){var a,b,c;return function(d){var e=d.w*d.w,f=d.x*d.x,j=d.y*d.y,l=d.z*d.z,m=e+f+j+l,n=d.w*d.x+d.y*d.z,o=1e-6;if(n>(.5-o)*m)a=2*Math.atan2(d.y,d.w),b=h,c=0;else if((-.5+o)*m>n)a=-2*Math.atan2(d.y,d.w),b=-h,c=0;else{var p=e-f+j-l,q=2*(d.w*d.z-d.x*d.y),r=e-f-j+l,s=2*(d.w*d.y-d.x*d.z);r>0?(a=Math.atan2(q,p),b=Math.asin(2*n/m),c=Math.atan2(s,r)):(a=Math.atan2(-q,-p),b=-Math.asin(2*n/m),b+=0>b?g:-g,c=Math.atan2(-s,-r))}0>a&&(a+=i),a*=k,b*=k,c*=k,this.set(a,b,c)}}(),this.rotateX=function(a){return t.Euler.prototype.rotateByAxisAngle(this,[1,0,0],a),this},this.rotateY=function(a){return t.Euler.prototype.rotateByAxisAngle(this,[0,1,0],a),this},this.rotateZ=function(a){return t.Euler.prototype.rotateByAxisAngle(this,[0,0,1],a),this},this.set(a,b,c)},t.Euler.prototype={constructor:t.Euler,rotateByAxisAngle:function(){var a=new t.RotationMatrix;return function(b,c,d){return a.setFromEuler(b),a=t.RotationMatrix.prototype.rotateByAxisAngle(a,c,d),b.setFromRotationMatrix(a),b}}()},t.DeviceOrientation=function(b){this.options=b||{};var c=0,d=200,e=0,f=10;if(this.alphaOffsetScreen=0,this.alphaOffsetDevice=void 0,"game"===this.options.type){var g=function(b){return null!==b.alpha&&(this.alphaOffsetDevice=new t.Euler(b.alpha,0,0),this.alphaOffsetDevice.rotateZ(-o),++e>=f)?void a.removeEventListener("deviceorientation",g,!1):void(++c>=d&&a.removeEventListener("deviceorientation",g,!1))}.bind(this);a.addEventListener("deviceorientation",g,!1)}else if("world"===this.options.type){var h=function(b){return b.absolute!==!0&&void 0!==b.webkitCompassAccuracy&&null!==b.webkitCompassAccuracy&&+b.webkitCompassAccuracy>=0&&+b.webkitCompassAccuracy<50&&(this.alphaOffsetDevice=new t.Euler(b.webkitCompassHeading,0,0),this.alphaOffsetDevice.rotateZ(o),this.alphaOffsetScreen=o,++e>=f)?void a.removeEventListener("deviceorientation",h,!1):void(++c>=d&&a.removeEventListener("deviceorientation",h,!1))}.bind(this);a.addEventListener("deviceorientation",h,!1)}},t.DeviceOrientation.prototype={constructor:t.DeviceOrientation,start:function(b){b&&"[object Function]"==Object.prototype.toString.call(b)&&l.orientation.callbacks.push(b),m||(n?a.screen.orientation.addEventListener("change",d,!1):a.addEventListener("orientationchange",d,!1)),l.orientation.active||(a.addEventListener("deviceorientation",e,!1),l.orientation.active=!0)},stop:function(){l.orientation.active&&(a.removeEventListener("deviceorientation",e,!1),l.orientation.active=!1)},listen:function(a){this.start(a)},getFixedFrameQuaternion:function(){var a=new t.Euler,b=new t.RotationMatrix,c=new t.Quaternion;return function(){var d=l.orientation.data||{alpha:0,beta:0,gamma:0},e=d.alpha;return this.alphaOffsetDevice&&(b.setFromEuler(this.alphaOffsetDevice),b.rotateZ(-this.alphaOffsetScreen),a.setFromRotationMatrix(b),a.alpha<0&&(a.alpha+=360),a.alpha%=360,e-=a.alpha),a.set(e,d.beta,d.gamma),c.setFromEuler(a),c}}(),getScreenAdjustedQuaternion:function(){var a;return function(){return a=this.getFixedFrameQuaternion(),a.rotateZ(-o),a}}(),getFixedFrameMatrix:function(){var a=new t.Euler,b=new t.RotationMatrix;return function(){var c=l.orientation.data||{alpha:0,beta:0,gamma:0},d=c.alpha;return this.alphaOffsetDevice&&(b.setFromEuler(this.alphaOffsetDevice),b.rotateZ(-this.alphaOffsetScreen),a.setFromRotationMatrix(b),a.alpha<0&&(a.alpha+=360),a.alpha%=360,d-=a.alpha),a.set(d,c.beta,c.gamma),b.setFromEuler(a),b}}(),getScreenAdjustedMatrix:function(){var a;return function(){return a=this.getFixedFrameMatrix(),a.rotateZ(-o),a}}(),getFixedFrameEuler:function(){var a,b=new t.Euler;return function(){return a=this.getFixedFrameMatrix(),b.setFromRotationMatrix(a),b}}(),getScreenAdjustedEuler:function(){var a,b=new t.Euler;return function(){return a=this.getScreenAdjustedMatrix(),b.setFromRotationMatrix(a),b}}(),isAbsolute:function(){return l.orientation.data&&l.orientation.data.absolute===!0?!0:!1},getLastRawEventData:function(){return l.orientation.data||{}},ALPHA:"alpha",BETA:"beta",GAMMA:"gamma"},t.DeviceMotion=function(a){this.options=a||{}},t.DeviceMotion.prototype={constructor:t.DeviceMotion,start:function(b){b&&"[object Function]"==Object.prototype.toString.call(b)&&l.motion.callbacks.push(b),m||(n?a.screen.orientation.addEventListener("change",d,!1):a.addEventListener("orientationchange",d,!1)),l.motion.active||(a.addEventListener("devicemotion",f,!1),l.motion.active=!0)},stop:function(){l.motion.active&&(a.removeEventListener("devicemotion",f,!1),l.motion.active=!1)},listen:function(a){this.start(a)},getScreenAdjustedAcceleration:function(){var a=l.motion.data&&l.motion.data.acceleration?l.motion.data.acceleration:{x:0,y:0,z:0},b={};switch(o){case p:b.x=-a.y,b.y=a.x;break;case q:b.x=-a.x,b.y=-a.y;break;case r:case s:b.x=a.y,b.y=-a.x;break;default:b.x=a.x,b.y=a.y}return b.z=a.z,b},getScreenAdjustedAccelerationIncludingGravity:function(){var a=l.motion.data&&l.motion.data.accelerationIncludingGravity?l.motion.data.accelerationIncludingGravity:{x:0,y:0,z:0},b={};switch(o){case p:b.x=-a.y,b.y=a.x;break;case q:b.x=-a.x,b.y=-a.y;break;case r:case s:b.x=a.y,b.y=-a.x;break;default:b.x=a.x,b.y=a.y}return b.z=a.z,b},getScreenAdjustedRotationRate:function(){var a=l.motion.data&&l.motion.data.rotationRate?l.motion.data.rotationRate:{alpha:0,beta:0,gamma:0},b={};switch(o){case p:b.beta=-a.gamma,b.gamma=a.beta;break;case q:b.beta=-a.beta,b.gamma=-a.gamma;break;case r:case s:b.beta=a.gamma,b.gamma=-a.beta;break;default:b.beta=a.beta,b.gamma=a.gamma}return b.alpha=a.alpha,b},getLastRawEventData:function(){return l.motion.data||{}}},a.FULLTILT=t}}(window);

/*jslint indent: 4, white: true, nomen: true, regexp: true, unparam: true, node: true, browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true*/
/*global FULLTILT, window, document, setTimeout, clearTimeout, navigator, IntersectionObserver*/

(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        define(factory);
    } else if (typeof module === "object" && module.exports) {
        module.exports = factory();
    } else {
        root.Parallax = factory();
    }
}(typeof self !== "undefined" ? self : this, function () {

    var TRANSFORM_PROP = (function () {

            var el = document.createElement("div"),

                prefixes = ["o", "ms", "moz", "webkit"],

                use = "transform",

                p = prefixes.length - 1, prop;

            for (p; p >= 0; p--) {

                prop = prefixes[p] + "Transform";

                if (el.style[prop] !== undefined) {

                    return prop;
                }
            }

            return use;
        }()),

        TRANSFORM_3D = (function () {

            var el = document.createElement("div");

            el.style[TRANSFORM_PROP] = "translate3d(0,0,0)";

            return !!el.style[TRANSFORM_PROP] && !window.navigator.userAgent.match(/Trident/);
        }()),

        SUPPORTS_TRANSFORM = document.body.style[TRANSFORM_PROP] !== undefined,

        SUPPORTS_INTERSECTION_OBSERVER = !!window.IntersectionObserver,
        SUPPORTS_RESIZE_OBSERVER = !!window.ResizeObserver,

        SUPPORTS_RAF = !!window.requestAnimationFrame;


    var extend = function () {

        var i = 1, key;

        for (i; i < arguments.length; i++) {

            for (key in arguments[i]) {

                if (arguments[i].hasOwnProperty(key)) {

                    arguments[0][key] = arguments[i][key];
                }
            }
        }

        return arguments[0];
    };


    var ParallaxController = (function () {

        var TILT_LIMIT = 67.5,
            FAKE_TILT_REDUCER = 0.5,

            TYPE_TILT = 1,
            TYPE_SCROLL = 2,
            TYPE_FAKE_TILT = 3,

            isMobile = /Mobi/.test(navigator.userAgent),

            initialized = false,
            watchingTilt = false,
            scrollAndFakeTiltEventsActivated = false,

            instanceCounter = 0,
            parallaxInstances = {},

            refreshDebounce = {},

            rafUpdate,
            parallaxesToUpdate = [],

            intersectionObserver,
            intersectingParallaxes = { length: 0 },

            winHeight = 0,
            realWinHeight = 0,
            winWidth = 0,
            winScrollTop = 0,

            initialBeta = null,
            currentTiltX = 0,
            currentTiltY = 0,

            lastTiltWasFake = false,

            updateParallaxesScroll,

            _getRealWinHeight = function () {

                return document.documentElement.clientHeight > window.innerHeight || isMobile ? window.innerHeight : document.documentElement.clientHeight;
            },

            _getScrollTop = function () {

                return (window.pageYOffset || document.documentElement.scrollTop) - (document.documentElement.clientTop || 0);
            },

            getParallaxByEl = function (el) {

                var p;

                for (p in parallaxInstances) {

                    if (parallaxInstances.hasOwnProperty(p) && parallaxInstances[p].elParallax === el) {

                        return parallaxInstances[p];
                    }
                }

                return null;
            },

            updateByRAF = function () {

                if (parallaxesToUpdate.length) {

                    var p;

                    for (p = 0; p < parallaxesToUpdate.length; p++) {

                        parallaxesToUpdate[p].transform(lastTiltWasFake);
                    }

                    parallaxesToUpdate = [];
                }

                rafUpdate = null;
            },

            //v případě, že je sekce vidět, zavolá metodu transform příslušného Parallaxu
            updateParallaxes = function (type, parallaxId, forceIntersectionCheck) {

                winScrollTop = _getScrollTop();

                var parallaxesSource = SUPPORTS_INTERSECTION_OBSERVER ? intersectingParallaxes : parallaxInstances,
                    p, parallax;

                for (p in parallaxesSource) {

                    if (parallaxesSource[p] instanceof window.Parallax) {

                        parallax = parallaxInstances[p];

                        if (parallax.disabled || ~parallaxesToUpdate.indexOf(parallax)) {

                            continue;
                        }

                        if (typeof parallaxId === "string" || typeof parallaxId === "number") {

                            if (parallax.id !== parallaxId) {

                                continue;
                            }
                        }

                        if (type === TYPE_TILT && !parallax.useTilt) {

                            continue;
                        }

                        //použít fake-tilt pouze v případě, že zařízení nepodporuje tilt a tilt má být použit
                        if (type === TYPE_FAKE_TILT && ((watchingTilt && parallax.useFakeTilt) || !parallax.useFakeTilt || !parallax.useTilt)) {

                            continue;
                        }

                        if (SUPPORTS_INTERSECTION_OBSERVER && forceIntersectionCheck !== true) {

                            parallaxesToUpdate.push(parallax);

                            if (!rafUpdate && SUPPORTS_RAF) {

                                rafUpdate = window.requestAnimationFrame(updateByRAF);
                            }

                            continue;
                        }

                        var parallaxOffsetTop = parallax.getOffset(),
                            parallaxBottom = parallaxOffsetTop + parallax.getParallaxHeight(),

                            winBottom = winScrollTop + winHeight;

                        if (winBottom > parallaxOffsetTop && winScrollTop < parallaxBottom) {

                            parallaxesToUpdate.push(parallax);

                            if (!rafUpdate && SUPPORTS_RAF) {

                                rafUpdate = window.requestAnimationFrame(updateByRAF);
                            }
                        }
                    }
                }

                if (!SUPPORTS_RAF) {

                    for (p = 0; p < parallaxesToUpdate.length; p++) {

                        parallaxesToUpdate[p].transform(lastTiltWasFake);
                    }

                    parallaxesToUpdate = [];
                }
            },

            refresh = function (force) {

                if (force !== true && (document.documentElement.clientHeight === winHeight && document.documentElement.clientWidth === winWidth)) {

                    return;
                }

                winHeight = document.documentElement.clientHeight;
                winWidth = document.documentElement.clientWidth;
                winScrollTop = _getScrollTop();
                realWinHeight = _getRealWinHeight();

                initialBeta = null;

                var parallax, p;

                for (p in parallaxInstances) {

                    if (parallaxInstances.hasOwnProperty(p)) {

                        parallax = parallaxInstances[p];

                        if (parallax.options.debounce) {

                            clearTimeout(refreshDebounce[parallax.id]);

                            refreshDebounce[parallax.id] = setTimeout(parallax.refresh.bind(parallax), parallax.options.debounce);

                        } else {

                            parallax.refresh();
                        }
                    }
                }
            },

            onFakeTilt = function (e) {

                if (watchingTilt) {

                    return;
                }

                lastTiltWasFake = true;

                var x = ((e.clientX || 0) / winWidth) * 2,
                    y = ((e.clientY || 0) / winHeight) * 2;

                x = TILT_LIMIT * (x > 1 ? x - 1 : -1 + x);
                y = TILT_LIMIT * (y > 1 ? y - 1 : -1 + y);

                currentTiltX = x * -1 * FAKE_TILT_REDUCER;
                currentTiltY = y * -1 * FAKE_TILT_REDUCER;

                updateParallaxes.call(this, TYPE_FAKE_TILT);
            },

            watchTilt = function () {

                if (!window.FULLTILT || !window.Promise || !window.Float32Array) {

                    return;
                }

                var promise = FULLTILT.getDeviceOrientation();

                promise.then(function(orientationControl) {

                    orientationControl.listen(function() {

                        lastTiltWasFake = false;

                        watchingTilt = true;

                        var euler = orientationControl.getScreenAdjustedEuler();

                        // Don't update CSS position if we are close to encountering gimbal lock
                        if (euler.beta > 85 && euler.beta < 95) {

                            return;
                        }

                        var tiltX = euler.gamma;

                        tiltX = tiltX > 0 ? Math.min(tiltX, TILT_LIMIT) : Math.max(tiltX, TILT_LIMIT * -1);

                        if (!initialBeta) {

                            initialBeta = euler.beta;
                        }

                        var tiltY = euler.beta - initialBeta;

                        tiltY = tiltY > 0 ? Math.min(tiltY, TILT_LIMIT) : Math.max(tiltY, TILT_LIMIT * -1);

                        currentTiltX = tiltX;
                        currentTiltY = tiltY;

                        updateParallaxes.call(this, TYPE_TILT);
                    });

                    refresh(true);
                });
            },

            initScrollAndFakeTiltEvents = function () {

                if (scrollAndFakeTiltEventsActivated) {

                    return;
                }

                scrollAndFakeTiltEventsActivated = true;

                window.addEventListener("scroll", updateParallaxesScroll);
                window.addEventListener("mousemove", onFakeTilt);
            },

            destroyScrollAndFakeTiltEvents = function () {

                if (!scrollAndFakeTiltEventsActivated) {

                    return;
                }

                scrollAndFakeTiltEventsActivated = false;

                window.removeEventListener("scroll", updateParallaxesScroll);
                window.removeEventListener("mousemove", onFakeTilt);
            },

            addToIntersectingParallaxes = function (parallax) {

                if (intersectingParallaxes[parallax.id]) {

                    return;
                }

                intersectingParallaxes[parallax.id] = parallax;

                intersectingParallaxes.length += 1;

                parallax.shouldRefreshOffset = true;

                updateParallaxes(TYPE_SCROLL, parallax.id);
            },

            removeFromIntersectingParallaxes = function (parallax) {

                if (!intersectingParallaxes[parallax.id]) {

                    return;
                }

                delete intersectingParallaxes[parallax.id];

                intersectingParallaxes.length -= 1;
            },

            onIntersectionChange = function (entry) {

                var parallax = getParallaxByEl(entry.target);

                if (!parallax) {

                    return;
                }

                if (entry.isIntersecting) {

                    addToIntersectingParallaxes(parallax);

                } else {

                    removeFromIntersectingParallaxes(parallax);
                }

                if (!intersectingParallaxes.length) {

                    destroyScrollAndFakeTiltEvents();

                    return;
                }

                initScrollAndFakeTiltEvents();
            },

            init = function () {

                if (initialized) {

                    return;
                }

                winHeight = document.documentElement.clientHeight;
                winWidth = document.documentElement.clientWidth;
                winScrollTop = _getScrollTop();
                realWinHeight = _getRealWinHeight();

                updateParallaxesScroll = updateParallaxes.bind(this, TYPE_SCROLL);
                onFakeTilt = onFakeTilt.bind(this);

                if (SUPPORTS_INTERSECTION_OBSERVER) {

                    intersectionObserver = new IntersectionObserver(function (entries) {

                        entries.forEach(onIntersectionChange);

                    }, { threshold: 0 });
                }

                if (!SUPPORTS_INTERSECTION_OBSERVER) {

                    initScrollAndFakeTiltEvents();
                }

                window.addEventListener("resize", refresh, false);

                if (!watchingTilt) {

                    watchTilt();
                }

                if (SUPPORTS_RAF) {

                    rafUpdate = window.requestAnimationFrame(updateByRAF);
                }

                initialized = true;
            },

            destroy = function () {

                if (SUPPORTS_RAF) {

                    window.cancelAnimationFrame(rafUpdate);

                    rafUpdate = null;
                }

                destroyScrollAndFakeTiltEvents();

                window.removeEventListener("resize", refresh);

                if (SUPPORTS_INTERSECTION_OBSERVER) {

                    intersectionObserver.disconnect();
                    intersectionObserver = null;

                    intersectingParallaxes = { length: 0 };
                }

                initialized = false;
            },

            add = function (parallax) {

                if (!parallaxInstances[parallax.id]) {

                    instanceCounter++;

                    parallaxInstances[parallax.id] = parallax;

                    setTimeout(updateParallaxes.bind(this, TYPE_SCROLL, parallax.id, true), 0);

                    if (SUPPORTS_INTERSECTION_OBSERVER) {

                        intersectionObserver.observe(parallax.elParallax);
                    }
                }
            },

            remove = function (parallax) {

                if (parallaxInstances[parallax.id]) {

                    instanceCounter--;

                    delete parallaxInstances[parallax.id];

                    if (SUPPORTS_INTERSECTION_OBSERVER) {

                        removeFromIntersectingParallaxes(parallax);

                        intersectionObserver.unobserve(parallax.elParallax);
                    }

                    if (!instanceCounter) {

                        destroy();
                    }
                }
            },

            getRealWinHeight = function () {

                return realWinHeight;
            },

            getWinHeight = function () {

                return winHeight;
            },

            getWinWidth = function () {

                return winWidth;
            },

            getWinScrollTop = function () {

                return winScrollTop;
            },

            getTilt = function () {

                return {
                    x: currentTiltX,
                    y: currentTiltY
                };
            },

            getTiltLimit = function () {

                return TILT_LIMIT;
            };

        return {
            init: init,
            destroy: destroy,
            refresh: refresh,

            add: add,
            remove: remove,

            getTilt: getTilt,
            getTiltLimit: getTiltLimit,
            getWinHeight: getWinHeight,
            getWinWidth: getWinWidth,
            getWinScrollTop: getWinScrollTop,
            getRealWinHeight: getRealWinHeight
        };

    }());

    var Layer = function Layer(el, parallax) {

            this.el = el;

            this.parallax = parallax;

            this.init();
        };

    Layer.prototype.init = function () {

        this.refresh(true);
    };

    Layer.prototype.refresh = function (preserveTransform) {

        var dataReverse = this.el.getAttribute("data-" + Layer.DATA.REVERSE.ATTR);

        this.reverseTilt = dataReverse === Layer.DATA.REVERSE.VAL.TILT || dataReverse === Layer.DATA.REVERSE.VAL.BOTH;
        this.reverseScroll = dataReverse === Layer.DATA.REVERSE.VAL.SCROLL || dataReverse === Layer.DATA.REVERSE.VAL.BOTH;

        this.mode = this.el.getAttribute("data-" + Layer.DATA.MODE.ATTR) || Layer.DATA.MODE.VAL.SCROLL;

        var c,

            CSS = {
                height: ""
            };

        if (!this.parallax.options.preserveStyles) {

            CSS.position = "absolute";
            CSS.top = "50%";
            CSS.left = "50%";
            CSS.bottom = "auto";
            CSS.right = "auto";
            CSS.minWidth = "100%";
            CSS.minHeight = "100%";

            CSS[TRANSFORM_PROP] = TRANSFORM_3D ? "translate3d(-50%, -50%, 0)" : "translate(-50%, -50%)";
        }

        for (c in CSS) {

            if (CSS.hasOwnProperty(c)) {

                this.el.style[c] = CSS[c];
            }
        }

        var rect = this.el.getBoundingClientRect();

        this.layerHeight = rect.height;
        this.layerWidth = rect.width;

        //velikost zvětšení sekce (polovina)
        this.parallaxXExtention = (this.layerWidth - this.parallax.parallaxWidth) / 2;
        this.parallaxYExtention = (this.layerHeight - this.parallax.parallaxHeight) / 2;

        if (this.mode === Layer.DATA.MODE.VAL.FIXED) {

            var fixedHeight = ParallaxController.getRealWinHeight() + (this.parallaxYExtention * 2);

            this.el.style.height = fixedHeight + "px";

            rect = this.el.getBoundingClientRect();

            this.layerHeight = rect.height;
        }

        //šířka je větší jak výška => použít na šířku rozměry výšky, jinak při tiltu bude parallax mimo
        if (this.parallaxXExtention > this.parallaxYExtention) {

            this.parallaxXExtention = this.parallaxYExtention;
        }

        if (this.parallax.useTilt) {

            this.tiltScrollRatio = this.parallaxXExtention / this.parallaxYExtention;

            this.parallaxTiltYExtention = this.parallaxYExtention * this.tiltScrollRatio;
            this.parallaxYExtention = this.parallaxYExtention * (1 - this.tiltScrollRatio);
        }

        this.wasIntersecting = false;

        if (!preserveTransform) {

            this.transform(true);
        }
    };

    Layer.DATA = {};

    Layer.DATA.REVERSE = {
        ATTR: "parallax-reverse",
        VAL: {
            TILT: "tilt",
            SCROLL: "scroll",
            BOTH: "both"
        }
    };

    Layer.DATA.MODE = {
        ATTR: "parallax-mode",
        VAL: {
            FIXED: "fixed",
            SCROLL: "scroll"
        }
    };

    Layer.prototype.transform = (function () {

        if (TRANSFORM_3D) {

            return function (x, y) {

                y = this.mode === Layer.DATA.MODE.VAL.FIXED ? Math.round(y) : y;
                x = this.mode === Layer.DATA.MODE.VAL.FIXED ? Math.round(x) : x;

                this.el.style[TRANSFORM_PROP] = x === true ? "translate3d(-50%, -50%, 0)" : x === false ? "" : "translate3d(" + x + "px, " + y + "px, 0)";
            };
        }

        return function (x, y) {

            y = this.mode === Layer.DATA.MODE.VAL.FIXED ? Math.round(y) : y;
            x = this.mode === Layer.DATA.MODE.VAL.FIXED ? Math.round(x) : x;

            this.el.style[TRANSFORM_PROP] = x === true ? "translate(-50%, -50%)" : x === false ? "" : "translate(" + x + "px, " + y + "px)";
        };
    }());

    var instanceCounter = 0,

        CLASS = {
            parallax: "parallax",
            layer: "parallax__layer"
        },

        DEFAULTS = {
            parallax: "." + CLASS.parallax,
            layers: "." + CLASS.layer,
            useTilt: true,
            fakeTilt: true,
            refreshOnResize: true,
            debounce: 0,
            resizeInterval: 1000,
            removeIfNotSupported: false,
            preserveStyles: false,
            onTransform: null,
            onBeforeTransform: null,
            onFirstIntersection: null
        },

        loadElements = function (options) {

            if (typeof options.parallax === "string") {

                this.elParallax = document.querySelector(options.parallax);

            } else if ((window.HTMLElement && options.parallax instanceof window.HTMLElement) || (window.SVGElement && options.parallax instanceof window.SVGElement)) {

                this.elParallax = options.parallax;

            } else if (options.parallax.jquery) {

                this.elParallax = options.parallax[0];
            }

            if (!options.layers) {

                this.elLayers = [];

                for (var c in this.elParallax.children) {

                    if (this.elParallax.children.hasOwnProperty(c) && !this.elParallax.children[c].tagName.match(/^(no)?script$/i)) {

                        this.elLayers.push(this.elParallax.children[c]);
                    }
                }

            } else if (typeof options.layers === "string") {

                this.elLayers = this.elParallax.querySelectorAll(options.layers);

            } else if (window.HTMLElement && options.layers instanceof window.HTMLElement) {

                this.elLayers = [options.layers];

            } else if (options.layers.jquery) {

                this.elLayers = options.layers.toArray();
            }

            this.elLayers = Array.prototype.slice.call(this.elLayers, 0);
        },

        initResizeParallaxObserver = function () {

            clearTimeout(this.resizeParallaxDebounce);

            if (SUPPORTS_RAF) {

                cancelAnimationFrame(this.resizeParallaxDebounce);
            }

            if (SUPPORTS_RESIZE_OBSERVER) {

                if (this.resizeObserver) {

                    return;
                }

                this.resizeObserver = new ResizeObserver(function (entries) {

                    if (this.parallaxWidth !== entries[0].contentRect.width || this.parallaxHeight !== entries[0].contentRect.height) {

                        if (SUPPORTS_RAF && !this.options.debounce) {

                            this.resizeParallaxDebounce = requestAnimationFrame(this.refresh.bind(this));

                        } else {

                            this.resizeParallaxDebounce = setTimeout(this.refresh.bind(this), this.options.debounce);
                        }
                    }
                }.bind(this));

            } else {

                clearInterval(this.resizeParallaxInterval);

                this.resizeParallaxInterval = setInterval(function () {

                    var currentRect = this.elParallax.getBoundingClientRect();

                    if (this.parallaxWidth !== currentRect.width || this.parallaxHeight !== currentRect.height) {

                        if (this.options.debounce) {

                            this.resizeParallaxDebounce = setTimeout(this.refresh.bind(this), this.options.debounce);

                        } else {

                            this.refresh();
                        }
                    }

                }.bind(this), this.options.resizeInterval);
            }
        },

        Parallax = function Parallax(options) {

            this.id = "Parallax-" + (instanceCounter++);

            this.options = typeof options === "string" ? { parallax: options } : options;

            this.disabled = false;

            this.refresh(this.options || DEFAULTS, true);
        };

    Parallax.prototype.destroy = function () {

        if (this.elLayers) {

            var layer = this.layers.length - 1;

            for (layer; layer >= 0; layer--) {

                this.layers[layer].transform(false);
            }
        }

        clearInterval(this.resizeParallaxInterval);
        clearTimeout(this.resizeParallaxDebounce);

        if (SUPPORTS_RAF) {

            cancelAnimationFrame(this.resizeParallaxDebounce);
        }

        if (this.resizeObserver) {

            this.resizeObserver.unobserve(this.elParallax);

            this.resizeObserver.disconnect();
        }

        this.resizeObserver = null;

        ParallaxController.remove(this);

        this.elParallax = null;
        this.elLayers = null;

        this.layers = [];

        this.initialized = false;
    };

    Parallax.prototype.refresh = function (options, elements) {

        if (this.resizeObserver) {

            this.resizeObserver.unobserve(this.elParallax);
        }

        if (!SUPPORTS_TRANSFORM) {

            options = typeof options === "object" ? extend({}, DEFAULTS, options) : this.options;

            loadElements.call(this, options);

            if (this.options.removeIfNotSupported) {

                this.elLayers.forEach(function (layer) {

                    layer.parentNode.removeChild(layer);
                });

            } else if (!this.options.preserveStyles) {

                this.elLayers.forEach(function (layer) {

                    var parallaxRect = this.elParallax.getBoundingClientRect(),
                        layerRect = layer.getBoundingClientRect();

                    layer.style.top = (layerRect.height - parallaxRect.height) / -2;
                    layer.style.left = (layerRect.width - parallaxRect.width) / -2;

                }.bind(this));
            }

            return;
        }

        options = typeof options === "object" ? extend({}, DEFAULTS, options) : this.options;

        this.options = options;

        this.useTilt = options.useTilt;
        this.useFakeTilt = options.useTilt && options.fakeTilt;

        if (elements || options === true || !this.elParallax || !this.elLayers) {

            loadElements.call(this, options);
        }

        if (!this.elParallax || !this.elLayers.length) {

            return;
        }

        ParallaxController.init();
        ParallaxController.add(this);

        var rect = this.elParallax.getBoundingClientRect();

        this.parallaxHeight = rect.height;
        this.parallaxWidth = rect.width;

        this.getOffset();
        this.shouldRefreshOffset = false;

        //rozsah parallaxu -> kolik pixelů bude efekt viditelný
        this.parallaxXOuterRange = this.parallaxWidth + ParallaxController.getWinWidth();
        this.parallaxYOuterRange = this.parallaxHeight + ParallaxController.getWinHeight();

        if (elements || options === true || !this.layers || !this.layers.length) {

            this.layers = [];

            this.elLayers.forEach(function (el) {

                this.layers.push(new Layer(el, this));

            }.bind(this));

        } else {

            var layer = this.layers.length - 1;

            for (layer; layer >= 0; layer--) {

                this.layers[layer].refresh();
            }
        }

        this.initialized = true;

        this.transform();

        if (this.options.refreshOnResize) {

            initResizeParallaxObserver.call(this);

            if (this.resizeObserver) {

                this.resizeObserver.observe(this.elParallax);
            }
        }
    };

    Parallax.prototype.getOffset = function () {

        this.offsetTop = this.elParallax.getBoundingClientRect().top + ParallaxController.getWinScrollTop();

        return this.offsetTop;
    };

    Parallax.prototype.transform = function (ignoreTilt) {

        if (!this.initialized) {

            return;
        }

        if (this.shouldRefreshOffset) {

            this.getOffset();

            this.shouldRefreshOffset = false;
        }

        var transform = { x: 0, y: 0 },

            //tilt
            tilt = ParallaxController.getTilt(),

            xPerc = this.useTilt && (!ignoreTilt || this.useFakeTilt) ? tilt.x / ParallaxController.getTiltLimit() : 0,
            yPerc = this.useTilt && (!ignoreTilt || this.useFakeTilt) ? tilt.y / ParallaxController.getTiltLimit() : 0,

            parallaxBottom = this.offsetTop + this.parallaxHeight,

            //kolik procent efektu již bylo provedeno (násobí se dvěma pro následující výpočty)
            parallaxProgression = ((parallaxBottom - ParallaxController.getWinScrollTop()) / this.parallaxYOuterRange) * 2;

        parallaxProgression = isFinite(parallaxProgression) ? parallaxProgression : 0;

        parallaxProgression = Math.max(0, Math.min(parallaxProgression, 2));

        //přepočet "parallaxProgression" od středu na rozsah mezi -1 a 1 (označující o kolik % "parallaxExtention" se má obrázek posunout)
        var progressionFromCenter = parallaxProgression > 1 ? (parallaxProgression - 1) * -1: 1 - parallaxProgression,

            realWinHeight = ParallaxController.getRealWinHeight(),

            l = this.layers.length - 1,

            layer,
            layerProgressionFromCenter,

            layerYPerc,
            layerXPerc;

        for (l; l >= 0; l--) {

            layer = this.layers[l];

            layerYPerc = layer.reverseTilt ? yPerc * -1 : yPerc;
            layerXPerc = layer.reverseTilt ? xPerc * -1 : xPerc;

            layerProgressionFromCenter = layer.reverseScroll ? progressionFromCenter * -1 : progressionFromCenter;

            //tilt
            transform.y = ((layer.parallaxTiltYExtention || 0) * layerYPerc);
            transform.x = ((layer.parallaxXExtention * layerXPerc) - (this.parallaxWidth / 2) - layer.parallaxXExtention);

            //scroll
            //odčítá se (this.parallaxHeight / 2), protože obrázek má top: 50%.

            if (layer.mode === Layer.DATA.MODE.VAL.SCROLL) {

                transform.y = (transform.y + (layer.parallaxYExtention * layerProgressionFromCenter) - (layer.layerHeight / 2));

            } else {

                transform.y = transform.y + (layer.parallaxYExtention * -layerProgressionFromCenter) + (((realWinHeight + this.parallaxHeight) / 2) * (layer.reverseScroll ? -layerProgressionFromCenter : layerProgressionFromCenter)) - (layer.layerHeight / 2);
            }

            if (!layer.wasIntersecting && layerProgressionFromCenter < 1 && layerProgressionFromCenter > -1) {

                layer.wasIntersecting = true;

                if (typeof this.options.onFirstIntersection === "function") {

                    this.options.onFirstIntersection.call(this, layer.$el, layerProgressionFromCenter, layerXPerc, layerYPerc, transform);

                } else if (this.options.onFirstIntersection instanceof Array && this.options.onFirstIntersection[l]) {

                    this.options.onFirstIntersection[l].call(this, layer.$el, layerProgressionFromCenter, layerXPerc, layerYPerc, transform);
                }
            }

            if (typeof this.options.onBeforeTransform === "function") {

                this.options.onBeforeTransform.call(this, layer.el, layerProgressionFromCenter, layerXPerc, layerYPerc, transform);

            } else if (this.options.onBeforeTransform instanceof Array && this.options.onBeforeTransform[l]) {

                this.options.onBeforeTransform[l].call(this, layer.el, layerProgressionFromCenter, layerXPerc, layerYPerc, transform);
            }

            layer.transform(transform.x, transform.y);

            if (typeof this.options.onTransform === "function") {

                this.options.onTransform.call(this, layer.el, layerProgressionFromCenter, layerXPerc, layerYPerc, transform);

            } else if (this.options.onTransform instanceof Array && this.options.onTransform[l]) {

                this.options.onTransform[l].call(this, layer.el, layerProgressionFromCenter, layerXPerc, layerYPerc, transform);
            }
        }
    };

    Parallax.prototype.getParallaxHeight = function () {

        return this.parallaxHeight;
    };

    Parallax.prototype.getParallaxWidth = function () {

        return this.parallaxWidth;
    };

    Parallax.prototype.enable = function () {

        this.disabled = false;
    };

    Parallax.prototype.disable = function () {

        this.disabled = true;
    };

    return Parallax;

}));

/*jslint indent: 4, white: true, nomen: true, regexp: true, unparam: true, node: true, browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true*/
/*global jQuery*/

(function (ns, $) {

    ns.$win = ns.$win || $(window);
    ns.$temp = ns.$temp || $([null]);

    ns.$BGObjectsOpacityAnimation = ns.$BGObjectsOpacityAnimation || $.Deferred();

    ns.BGObjectsOpacityAnimation = (function () {

        var CLASS = {
                stopAnimation: "section__background-layer--stop-animation",
                stopHover: "section__background-layer--stop-hover"
            },

            DATA = {
                objectSelector: "object-selector." + ns
            },

            EVENT = {
                add: "bg-object-opacity-animation__add." + ns
            },

            SUPPORTS_CSS_ANIMATIONS = typeof document.body.style.animation !== "undefined",

            ANIM_POSTFIX = "--fade-in",

            OPACITY_DURATION = 1500,
            MAX_OPACITY = 1,
            MIN_OPACITY = 0.25,
            MIN_CHANGE = 0.25,

            events = false,

            $layers = [],

            stopAnimation = false,

            lowPerf = false,

            animate = function (elSquare) {

                if (stopAnimation) {

                    elSquare.style.opacity = "";

                    return;
                }

                var currentOpacity = parseFloat(elSquare.style.opacity),

                    newRandomOpacity = (Math.random() * (MAX_OPACITY - MIN_OPACITY)) + MIN_OPACITY;

                if (Math.abs(currentOpacity - newRandomOpacity) < MIN_CHANGE) {

                    animate(elSquare);

                    return;
                }

                elSquare.style.opacity = newRandomOpacity;

                setTimeout(animate.bind(null, elSquare), OPACITY_DURATION);
            },

            manualInitAnimations = function ($bgLayers, objectSelector) {

                $bgLayers.each(function (i) {

                    ns.$temp[0] = this;

                    objectSelector = objectSelector || ns.$temp.data(DATA.objectSelector);

                    setTimeout(
                        animate.bind(null, ns.$temp.find(objectSelector)[0]),
                        OPACITY_DURATION * (i / ($bgLayers.length - 1))
                    );
                });
            },

            initPerformanceEvents = function () {

                ns.$win.on("lowperformance." + ns, function () {

                    lowPerf = true;

                    stopAnimation = true;

                    $layers.forEach(function ($bgLayers) {
                        $bgLayers.addClass(CLASS.stopAnimation);
                    });
                });

                ns.$win.on("verylowperformance." + ns, function () {

                    $layers.forEach(function ($bgLayers) {
                        $bgLayers.addClass(CLASS.stopHover);
                    });
                });

                ns.$win.on("technologies__opened." + ns + " technologies__closed." + ns, function (event) {

                    if (!lowPerf) {

                        stopAnimation = !!event.type.match(/opened/);

                        $layers.forEach(function ($bgLayers) {

                            $bgLayers[stopAnimation ? "addClass" : "removeClass"](CLASS.stopAnimation);

                            manualInitAnimations($bgLayers);
                        });
                    }
                });

                events = true;
            },

            hasNoAnimation = function ($bgLayers, objectSelector, animPostfix) {

                if (!SUPPORTS_CSS_ANIMATIONS) {

                    return true;
                }

                var $objects = $bgLayers.find(objectSelector);

                if ($objects.css("animation-name") === "none") {

                    return true;
                }

                var animations = $objects[0] && $objects[0].getAnimations ? $objects[0].getAnimations() : [];

                animations = animations.filter(function (animation) {

                    return !!animation.id.match(new RegExp(animPostfix + "$"));
                });

                return animations.length && animations[0].playState === "finished";
            },

            add = function (event, $bgLayers, objectSelector, animPostfix) {

                $layers.push($bgLayers);

                $bgLayers.data(DATA.objectSelector, objectSelector);

                if (!events) {

                    initPerformanceEvents();
                }

                if (hasNoAnimation($bgLayers, objectSelector, animPostfix || ANIM_POSTFIX)) {

                    manualInitAnimations($bgLayers, objectSelector);

                    return;
                }

                $bgLayers.on("animationend." + ns, function (event) {

                    if (event.originalEvent.animationName.match(new RegExp((animPostfix || ANIM_POSTFIX) + "$"))) {

                        animate(event.originalEvent.target);

                        ns.$temp[0] = this;

                        ns.$temp.off("animationend." + ns);
                    }
                });
            },

            init = function () {

                ns.$win.on(EVENT.add, add);
            };

        return {
            init: init
        };
    }());

    if (window.requestIdleCallback) {

        window.requestIdleCallback(ns.$BGObjectsOpacityAnimation.resolve);

    } else {

        setTimeout(ns.$BGObjectsOpacityAnimation.resolve, 0);
    }

}((function (ns) { window[ns] = window[ns] || { toString: function () { return ns; } }; return window[ns]; }("MJNS")), jQuery));

/*jslint indent: 4, white: true, nomen: true, regexp: true, unparam: true, node: true, browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true*/

(function (ns, $) {

    ns.$ParallaxLoader = ns.$ParallaxLoader || $.Deferred();

    if (window.requestIdleCallback) {

        window.requestIdleCallback(ns.$ParallaxLoader.resolve);

    } else {

        setTimeout(ns.$ParallaxLoader.resolve, 0);
    }

}((function (ns) { window[ns] = window[ns] || { toString: function () { return ns; } }; return window[ns]; }("MJNS")), jQuery));
