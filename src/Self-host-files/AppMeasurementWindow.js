/* 
We set window.AppMeasurement so that self hosting does not break. 
AppMeasurement.js references a window.AppMeasurement in its code
which only exists when AppMeasurement is in a script tag.

This ensures that accessing window.AppMeasurement does not throw
an error in a self-hosted environment.
*/
window.AppMeasurement = AppMeasurement;