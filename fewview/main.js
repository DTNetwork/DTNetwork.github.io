
        let lat; 
        let long; 
        let modal = false 
        let one; 
        let two; 
        let three; 
        let four; 

        var myIcon = L.divIcon({className: 'my-div-icon'});

        console.log(Object.keys(mapLayer))
        var map = L.map('map').setView([0, 0], 3);
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);
        map.zoomControl.setPosition('topright');

        var popup = L.popup();

       

        function onMapClick(e) {
            lat = e.latlng.lat
            long = e.latlng.lng
            fetch(`https://nominatim.openstreetmap.org/reverse.php?lat=${e.latlng.lat}&lon=${e.latlng.lng}&zoom=10&format=jsonv2`)
                .then(response => response.json())
                .then(data => {
                    popup
                        .setLatLng(e.latlng)
                        .setContent(`Data for ${data.display_name} <br/>
                    Sample Data: <b>XXX</b><br/>
                    Sample Data: <b>XXX</b><br/>

                    ${!modal ? `<button id='${data.display_name}' onClick="seeMore('${data.display_name}')">See More Info</button>` : `<button id='${data.display_name}' onClick="seeTrade('${data.display_name}')">See Trade Info</button> <button>See Routes</button>`}`)
                    .openOn(map);
                    
                   
                })

                console.log(lat + " "+ long)

        }

        map.on('click', onMapClick)


        let defaultMap = L.geoJSON(mapLayer.features, {
            style: {
                color: 'rgba(175, 170, 180, 1)',
                opacity: .2,
                lineWidth: .5,
                stroke: .5,
                zIndex: -10
            }
        }).addTo(map);



        function getColor(d) {
            let sum = 0
            let mathArray = []
            for (let x = 0; x < mapLayer.features.length; x++) {
                sum += mapLayer.features[x].properties.POP2005
                mathArray.push(mapLayer.features[x].properties.POP2005)
            }

            mathArray.sort((a, b) => b - a)





            return d == mathArray[0] ? '#537787' :
                d == mathArray[1] ? '#6F92A4' :
                    d == mathArray[2] ? '#8BAEC2' :
                        d == mathArray[3] ? '#A6CADF' :
                            d == mathArray[4] ? '#C2E6FC' :
                                '#A6ADB2'


        }

        function seeMore(value) {
            L.marker([lat, long], {icon: myIcon}).addTo(map);
            modal = true; 
            map.removeLayer(defaultMap)
            function style(features) {
                console.log(getColor(features.properties.POP2005))
                return {
                    fillColor: getColor(features.properties.POP2005),
                    weight: 2,
                    opacity: 1,
                    color: getColor(features.properties.POP2005),
                    fillOpacity: 0.7
                };
            }
            var choroplethLayer = L.geoJson(mapLayer, { style: style }).addTo(map);
            document.getElementById('bottomBar').style.display = "block"
            document.getElementById('legendOne').style.bottom = '300px'
            document.getElementById('legendTwo').style.bottom = '300px'
            let divElements = document.querySelectorAll('#containerBar > div')
            divElements[0].style.marginLeft = '10px'
            divElements.forEach((element) => {
                element.innerHTML = `graph for trade ${value}`
            });

            document.getElementById('filterHolder').innerHTML = `${value} added to filter <br/> Now, try clicking another location! This will showcase that users can only look at trade info when there is a value in the location filter.`

           one = L.Polyline.Arc([lat, long], [lat+10, long-20], {
                color: 'red',
                vertices: 500
            }).arrowheads().addTo(map);

            two = L.Polyline.Arc([lat, long], [lat+20, long-100], {
                color: 'red',
                vertices: 500
            }).arrowheads().addTo(map);

            three = L.Polyline.Arc([lat, long], [ 73.64639,  -73.71093], {
                color: 'red',
                vertices: 500
            }).arrowheads().addTo(map);

            four = L.Polyline.Arc([lat, long], [ 61.84854,  34.27132], {
                color: 'red',
                vertices: 500
            }).arrowheads().addTo(map);

        }

        function resetBar(){
            document.getElementById('bottomBar').style.display = "none"
            document.getElementById('legendOne').style.bottom = '50px'
            document.getElementById('legendTwo').style.bottom = '50px'
        }

        function seeTrade(value) {
            document.getElementById('modalView').style.display = "block"
            document.getElementById('header').innerHTML = `Commodity Information for ${value}`
            let divElements = document.querySelectorAll('#modalView > div > div')
            divElements.forEach((element) => {
                element.innerHTML =`graph for trade ${value}`
            });

        }


            function closeModal(id){
                id.style.display = 'none';
                let divElements = document.querySelectorAll('#modalView > div > div')
                divElements.forEach((element) => {
                    element.innerHTML =""
                });
    
            }


            document.getElementById('flows').addEventListener('click', function () {
                hide = true;
                document.getElementById('routesFilter').style.display = 'none'
                document.getElementById('routes').style.backgroundColor = 'transparent'
                document.getElementById('routes').style.color = 'rgba(54, 83, 245, 1)'
                document.getElementById('flows').style.backgroundColor = 'rgba(54, 83, 245, 1)'
                document.getElementById('flows').style.color = 'white'

            })

            document.getElementById('routes').addEventListener('click', function () {
                hide = false;
                document.getElementById('routesFilter').style.display = 'block'
                document.getElementById('flows').style.backgroundColor = 'transparent'
                document.getElementById('flows').style.color = 'rgba(54, 83, 245, 1)'
                document.getElementById('routes').style.backgroundColor = 'rgba(54, 83, 245, 1)'
                document.getElementById('routes').style.color = 'white'
               

            })
        


