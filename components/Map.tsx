import { useLogs } from "@/components/useLogs";
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";
import { scaleSequential } from "d3-scale";
import { interpolateBlues } from "d3-scale-chromatic";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const Map = () => {
  const { logs, countryCounts } = useLogs();

  const colorScale = scaleSequential(interpolateBlues).domain([0, Math.max(...Object.values(countryCounts))]);

  return (
    <div className="p-6 space-y-6 border rounded-lg">
      <div className="bg-gray-900 rounded-lg shadow-lg p-4">
        <h2 className="text-white text-xl font-semibold mb-4">Login Locations</h2>
        <div className="relative h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] w-full overflow-hidden rounded-md shadow-md bg-gray-800">
          <ComposableMap
            projection="geoMercator"
            projectionConfig={{ scale: 100, center: [0, 20] }}
            width={800} // Set a maximum width
            height={400} // Set a maximum height
            style={{ width: "100%", height: "100%" }}
          >
            <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  const countryCode = geo.properties.ISO_A2;
                  const fillColor = colorScale(countryCounts[countryCode] || 0);
                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill={fillColor}
                      stroke="#2d3748"
                      style={{
                        default: { outline: "none" },
                        hover: { fill: "#63b3ed", outline: "none" },
                        pressed: { fill: "#2c5282", outline: "none" },
                      }}
                    />
                  );
                })
              }
            </Geographies>

            {/* Add a marker for each log's coordinates */}
            {logs.map((log, index) =>
              log.latitude && log.longitude ? (
                <Marker key={index} coordinates={[log.longitude, log.latitude]}>
                  <circle r={4} fill="#FF5533" stroke="#FFF" strokeWidth={2} />
                </Marker>
              ) : null
            )}
          </ComposableMap>
        </div>
      </div>
    </div>
  );
};

export default Map;
