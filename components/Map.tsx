'use client'

import { useEffect, useState, useRef, useMemo } from 'react'
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup,Line } from 'react-simple-maps'
import { scaleSequential } from 'd3-scale'
import { interpolateBlues } from 'd3-scale-chromatic'
import { motion } from 'framer-motion'

const geoUrl = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json'

// Fixed coordinates for India
const INDIA_COORDINATES: [number, number] = [78.9629, 20.5937]

// Fixed coordinates for the United States
const US_COORDINATES: [number, number] = [-95.7129, 37.0902]

const NL_COORDINATES: [number, number] = [4.899, 52.3676] 


const SE_COORDINATES: [number, number] = [18.0686, 59.3293]

// Country codes mapping
const countryCodes: { [key: string]: string } = {

  AF: 'Afghanistan',
  AL: 'Albania',
  DZ: 'Algeria',
  AS: 'American Samoa',
  AD: 'Andorra',
  AO: 'Angola',
  AI: 'Anguilla',
  AQ: 'Antarctica',
  AG: 'Antigua and Barbuda',
  AR: 'Argentina',
  AM: 'Armenia',
  AW: 'Aruba',
  AU: 'Australia',
  AT: 'Austria',
  AZ: 'Azerbaijan',
  BS: 'Bahamas (the)',
  BH: 'Bahrain',
  BD: 'Bangladesh',
  BB: 'Barbados',
  BY: 'Belarus',
  BE: 'Belgium',
  BZ: 'Belize',
  BJ: 'Benin',
  BM: 'Bermuda',
  BT: 'Bhutan',
  BO: 'Bolivia (Plurinational State of)',
  BQ: 'Bonaire, Sint Eustatius and Saba',
  BA: 'Bosnia and Herzegovina',
  BW: 'Botswana',
  BV: 'Bouvet Island',
  BR: 'Brazil',
  IO: 'British Indian Ocean Territory (the)',
  BN: 'Brunei Darussalam',
  BG: 'Bulgaria',
  BF: 'Burkina Faso',
  BI: 'Burundi',
  CV: 'Cabo Verde',
  KH: 'Cambodia',
  CM: 'Cameroon',
  CA: 'Canada',
  KY: 'Cayman Islands (the)',
  CF: 'Central African Republic (the)',
  TD: 'Chad',
  CL: 'Chile',
  CN: 'China',
  CX: 'Christmas Island',
  CCK: 'Cocos (Keeling) Islands (the)',
  CO: 'Colombia',
  KM: 'Comoros (the)',
  CD: 'Congo (the Democratic Republic of the)',
  CG: 'Congo (the)',
  CK: 'Cook Islands (the)',
  CR: 'Costa Rica',
  HR: 'Croatia',
  CU: 'Cuba',
  CW: 'Curaçao',
  CY: 'Cyprus',
  CZ: 'Czechia',
  CI: "Côte d'Ivoire",
  DK: 'Denmark',
  DJ: 'Djibouti',
  DM: 'Dominica',
  DO: 'Dominican Republic (the)',
  EC: 'Ecuador',
  EG: 'Egypt',
  SV: 'El Salvador',
  GQ: 'Equatorial Guinea',
  ER: 'Eritrea',
  EE: 'Estonia',
  SZ: 'Eswatini',
  ET: 'Ethiopia',
  FK: 'Falkland Islands (the) [Malvinas]',
  FO: 'Faroe Islands (the)',
  FJ: 'Fiji',
  FI: 'Finland',
  FR: 'France',
  GF: 'French Guiana',
  PF: 'French Polynesia',
  TF: 'French Southern Territories (the)',
  GA: 'Gabon',
  GM: 'Gambia (the)',
  GE: 'Georgia',
  DE: 'Germany',
  GH: 'Ghana',
  GI: 'Gibraltar',
  GR: 'Greece',
  GL: 'Greenland',
  GD: 'Grenada',
  GP: 'Guadeloupe',
  GU: 'Guam',
  GT: 'Guatemala',
  GG: 'Guernsey',
  GN: 'Guinea',
  GW: 'Guinea-Bissau',
  GY: 'Guyana',
  HT: 'Haiti',
  HM: 'Heard Island and McDonald Islands',
  VA: 'Holy See (the)',
  HN: 'Honduras',
  HK: 'Hong Kong',
  HU: 'Hungary',
  IS: 'Iceland',
  IN: 'India',
  ID: 'Indonesia',
  IR: 'Iran (Islamic Republic of)',
  IQ: 'Iraq',
  IE: 'Ireland',
  IM: 'Isle of Man',
  IL: 'Israel',
  IT: 'Italy',
  JM: 'Jamaica',
  JP: 'Japan',
  JE: 'Jersey',
  JO: 'Jordan',
  KZ: 'Kazakhstan',
  KE: 'Kenya',
  KI: 'Kiribati',
  KP: "Korea (the Democratic People's Republic of)",
  KR: 'Korea (the Republic of)',
  KW: 'Kuwait',
  KG: 'Kyrgyzstan',
  LA: "Lao People's Democratic Republic (the)",
  LV: 'Latvia',
  LB: 'Lebanon',
  LS: 'Lesotho',
  LR: 'Liberia',
  LY: 'Libya',
  LI: 'Liechtenstein',
  LT: 'Lithuania',
  LU: 'Luxembourg',
  MO: 'Macao',
  MG: 'Madagascar',
  MW: 'Malawi',
  MY: 'Malaysia',
  MV: 'Maldives',
  ML: 'Mali',
  MT: 'Malta',
  MH: 'Marshall Islands (the)',
  MQ: 'Martinique',
  MR: 'Mauritania',
  MU: 'Mauritius',
  YT: 'Mayotte',
  MX: 'Mexico',
  FM: 'Micronesia (Federated States of)',
  MD: 'Moldova (the Republic of)',
  MC: 'Monaco',
  MN: 'Mongolia',
  ME: 'Montenegro',
  MS: 'Montserrat',
  MA: 'Morocco',
  MZ: 'Mozambique',
  MM: 'Myanmar',
  NA: 'Namibia',
  NR: 'Nauru',
  NP: 'Nepal',
  NL: 'Netherlands (the)',
  NC: 'New Caledonia',
  NZ: 'New Zealand',
  NI: 'Nicaragua',
  NE: 'Niger (the)',
  NG: 'Nigeria',
  NU: 'Niue',
  NF: 'Norfolk Island',
  MP: 'Northern Mariana Islands (the)',
  NO: 'Norway',
  OM: 'Oman',
  PK: 'Pakistan',
  PW: 'Palau',
  PS: 'Palestine, State of',
  PA: 'Panama',
  PG: 'Papua New Guinea',
  PY: 'Paraguay',
  PE: 'Peru',
  PH: 'Philippines (the)',
  PN: 'Pitcairn',
  PL: 'Poland',
  PT: 'Portugal',
  PR: 'Puerto Rico',
  QA: 'Qatar',
  MK: 'Republic of North Macedonia',
  RO: 'Romania',
  RU: 'Russian Federation (the)',
  RW: 'Rwanda',
  RE: 'Réunion',
  BL: 'Saint Barthélemy',
  SH: 'Saint Helena, Ascension and Tristan da Cunha',
  KN: 'Saint Kitts and Nevis',
  LC: 'Saint Lucia',
  LCA: 'Saint Martin (French part)',
  PM: 'Saint Pierre and Miquelon',
  VC: 'Saint Vincent and the Grenadines',
  WS: 'Samoa',
  SM: 'San Marino',
  ST: 'Sao Tome and Principe',
  SA: 'Saudi Arabia',
  SN: 'Senegal',
  RS: 'Serbia',
  SC: 'Seychelles',
  SL: 'Sierra Leone',
  SG: 'Singapore',
  SX: 'Sint Maarten (Dutch part)',
  SK: 'Slovakia',
  SI: 'Slovenia',
  SB: 'Solomon Islands',
  SO: 'Somalia',
  ZA: 'South Africa',
  GS: 'South Georgia and the South Sandwich Islands',
  SS: 'South Sudan',
  ES: 'Spain',
  LK: 'Sri Lanka',
  SD: 'Sudan (the)',
  SR: 'Suriname',
  SJ: 'Svalbard and Jan Mayen',
  SE: 'Sweden',
  CH: 'Switzerland',
  SY: 'Syrian Arab Republic',
  TW: 'Taiwan (Province of China)',
  TJ: 'Tajikistan',
  TZ: 'Tanzania, United Republic of',
  TH: 'Thailand',
  TL: 'Timor-Leste',
  TG: 'Togo',
  TK: 'Tokelau',
  TO: 'Tonga',
  TT: 'Trinidad and Tobago',
  TN: 'Tunisia',
  TR: 'Turkey',
  TM: 'Turkmenistan',
  TC: 'Turks and Caicos Islands (the)',
  TV: 'Tuvalu',
  UG: 'Uganda',
  UA: 'Ukraine',
  AE: 'United Arab Emirates (the)',
  GB: 'United Kingdom of Great Britain and Northern Ireland (the)',
  UMI: 'United States Minor Outlying Islands (the)',
  US: 'United States of America (the)',
  UY: 'Uruguay',
  UZ: 'Uzbekistan',
  VU: 'Vanuatu',
  VE: 'Venezuela (Bolivarian Republic of)',
  VN: 'Viet Nam',
  VG: 'Virgin Islands (British)',
  VI: 'Virgin Islands (U.S.)',
  WF: 'Wallis and Futuna',
  EH: 'Western Sahara',
  YE: 'Yemen',
  ZM: 'Zambia',
  ZW: 'Zimbabwe',
  AX: 'Åland Islands',
};


interface Log {
  name: string
  email: string
  requester: string
  timestamp: string
  ip: string
  countryCode: string
  latitude: number
  longitude: number
}

interface MarkerType {
  key: number
  coordinates: [number, number]
  timestamp: number
  color: string
  log: Log
}

export default function Map() {
  const [countryCounts, setCountryCounts] = useState<{ [key: string]: number }>({})
  const [error, setError] = useState<string | null>(null)
  const [activeMarker, setActiveMarker] = useState<Log | null>(null)
  const [animationInProgress, setAnimationInProgress] = useState(false)
  const [markers, setMarkers] = useState<MarkerType[]>([])
  const [currentMarkerIndex, setCurrentMarkerIndex] = useState(0)
  const animationRef = useRef<number | null>(null)

  const colorScale = useMemo(
    () => scaleSequential(interpolateBlues).domain([0, Math.max(...Object.values(countryCounts)) || 1]),
    [countryCounts]
  )

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await fetch('https://mauthn.mukham.in/all_logs', {
          method: 'GET',
          headers: { logsauth: 'authorized' },
        })

        if (!response.ok) throw new Error('Failed to fetch logs')

        const data = await response.json()
        const processedLogs = data.map((entry: Log) => {
          const requesterInfo = entry.requester || ''
          const countryCodeMatch = requesterInfo.match(/Country Code: (\w+)/)
          const countryCode = countryCodeMatch ? countryCodeMatch[1] : 'Unknown'

          return {
            ...entry,
            countryCode,
            latitude: parseFloat(requesterInfo.match(/Latitude: ([\d.-]+)/)?.[1] || '0'),
            longitude: parseFloat(requesterInfo.match(/Longitude: ([\d.-]+)/)?.[1] || '0'),
          }
        })

        setCountryCounts(processedLogs)
        // Update country counts
        const counts = processedLogs.reduce((acc: { [key: string]: number }, log: Log) => {
          acc[log.countryCode] = (acc[log.countryCode] || 0) + 1
          return acc
        }, {})
        setCountryCounts(counts)

        // Create markers
        const loginMarkers: MarkerType[] = processedLogs.map((log: Log, index: number) => ({
          key: index,
          coordinates: [log.longitude, log.latitude] as [number, number],
          timestamp: new Date(log.timestamp).getTime(),
          color: '#4299E1',
          log,
        }))
        setMarkers(loginMarkers)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error fetching logs')
      }
    }

    fetchLogs()
  }, [])

  const animateMarkers = () => {
    if (animationInProgress) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      setAnimationInProgress(false)
      setCurrentMarkerIndex(0)
      return
    }

    setAnimationInProgress(true)
    let index = 0

    const animate = () => {
      if (index < markers.length) {
        setCurrentMarkerIndex(index)
        setActiveMarker(markers[index].log)
        index++
        animationRef.current = requestAnimationFrame(animate)
      } else {
        setAnimationInProgress(false)
        setCurrentMarkerIndex(0)
      }
    }

    animate()
  }

  return (
    <div className="p-6 space-y-6 border rounded-lg">
      <div className="bg-gray-900 rounded-lg shadow-lg p-4">
        <h2 className="text-white text-xl font-semibold mb-4">Login Locations</h2>

        {error && <div className="text-red-500">{error}</div>}

        <div className="relative h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] w-full overflow-hidden rounded-md shadow-md bg-gray-800">
          <ComposableMap
            projection="geoMercator"
            projectionConfig={{ scale: 100 }}
            style={{ width: '100%', height: '100%' }}
          >
            <ZoomableGroup center={[0, 20]} zoom={1}>
              <Geographies geography={geoUrl}>
                {({ geographies }) =>
                  geographies.map((geo) => (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill={colorScale(countryCounts[geo.properties.ISO_A2] || 0)}
                      stroke="#2d3748"
                      style={{
                        default: { outline: 'none' },
                        hover: { fill: '#63b3ed', outline: 'none' },
                        pressed: { fill: '#2c5282', outline: 'none' },
                      }}
                    />
                  ))
                }
              </Geographies>

              {/* Fixed marker for India */}
              <Marker coordinates={INDIA_COORDINATES}>
                <circle r={6} fill="#FF6B6B" stroke="#FFF" strokeWidth={2} />
              </Marker>

              {/* Fixed marker for US */}
              <Marker coordinates={US_COORDINATES}>
                <circle r={6} fill="#FF6B6B" stroke="#FFF" strokeWidth={2} />
              </Marker>

              <Marker coordinates={NL_COORDINATES}>
        <circle r={6} fill="#FF6B6B" stroke="#FFF" strokeWidth={2} />
      </Marker>

      {/* Marker for Sweden */}
      <Marker coordinates={SE_COORDINATES}>
        <circle r={6} fill="#FF6B6B" stroke="#FFF" strokeWidth={2} />
      </Marker>

              {/* Dynamic markers */}
              {markers.slice(0, currentMarkerIndex + 1).map((marker) => {
        // Determine the correct coordinates for the line's starting point
        let startCoordinates = null;
        if (marker.log.countryCode === 'IN') {
          startCoordinates = INDIA_COORDINATES;
        } else if (marker.log.countryCode === 'US') {
          startCoordinates = US_COORDINATES;
        } else if (marker.log.countryCode === 'NL') {
          startCoordinates = NL_COORDINATES;
        } else if (marker.log.countryCode === 'SE') {
          startCoordinates = SE_COORDINATES;
        }

        return (
          <motion.g
            key={marker.key}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            {/* Marker */}
            <Marker coordinates={marker.coordinates}>
              <circle r={4} fill={marker.color} stroke="#FFF" strokeWidth={2} />
            </Marker>

            {/* Conditional Line */}
            {startCoordinates && (
              <Line
                from={startCoordinates}
                to={marker.coordinates}
                stroke="#FF9F1C"
                strokeWidth={2}
                strokeLinecap="round"
              />
            )}
          </motion.g>
        );
      })}
            </ZoomableGroup>
          </ComposableMap>
        </div>

        <button
          className={`mt-4 px-4 py-2 ${
            animationInProgress ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'
          } text-white rounded transition-colors`}
          onClick={animateMarkers}
        >
          {animationInProgress ? 'Stop Animation' : 'Start Animation'}
        </button>

        {activeMarker && (
          <div className="mt-4 p-4 bg-gray-700 rounded-lg text-white">
            <h3 className="font-semibold">Login Details</h3>
            <p>
              <strong>User:</strong> {activeMarker.name}
            </p>
            <p>
              <strong>Email:</strong> {activeMarker.email}
            </p>
            <p>
              <strong>Country:</strong> {countryCodes[activeMarker.countryCode] || 'Unknown'}
            </p>
            <p>
              <strong>Timestamp:</strong> {new Date(activeMarker.timestamp).toLocaleString()}
            </p>
            <p>
              <strong>IP:</strong> {activeMarker.ip}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}


