# GEE-WaterChange
Generation  of water change layer from period 1 to period 2 using google earth engine. 

> https://bharathk113.github.io

![GitHub stars](https://img.shields.io/github/stars/bharathk113/bharathk113.github.io)
![GitHub forks](https://img.shields.io/github/forks/bharathk113/bharathk113.github.io)
[![Maintenance](https://img.shields.io/badge/maintained-yes-green.svg)](https://github.com/bharathk113/bharathk113.github.io/commits/master)
[![Website shields.io](https://img.shields.io/badge/website-up-yellow)](http://bharathk113.github.io/)
[![Ask Me Anything !](https://img.shields.io/badge/ask%20me-linkedin-1abc9c.svg)](https://www.linkedin.com/in/bharath-reddy-k/)
[![License](http://img.shields.io/:license-mit-blue.svg?style=flat-square)](http://badges.mit-license.org)

:star: Star me on GitHub — it helps!


Add this whenever you need to export any layer to your google drive
````
Export.image.toDrive({
 image: image_to_export,
 description: 'description',
 scale: 10,
 region: roi
});
````
## Sentinel-1
- Only Sentinel-1 data is implemented.
- The change layer is computed between two time periods. Each time period in itself can have time range and this code tries to use the maximum extent of water if more than 1 pass is present in each period.
- Each time period should be atleast of of 1 month range.
- More generalized selection of time period may be incorporated in future.

[Link to ccde on Earth Engine](https://code.earthengine.google.co.in/?scriptPath=users%2Fbharathkadapala%2FTools%3AWaterChange-S1)

Please report any issues with this code. More sensors for similar application may be added in future.
