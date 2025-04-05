import { useState } from 'react';
import { 
  ComposableMap, 
  Geographies, 
  Geography,
  ZoomableGroup 
} from 'react-simple-maps';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tooltip } from '@/components/ui/tooltip';

const geoUrl = 'https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json';

interface StateData {
  state: string;
  value: number;
}

interface GeographyUSAProps {
  data: StateData[];
  title: string;
  color: string;
}

export const GeographyUSA = ({ data, title, color }: GeographyUSAProps) => {
  const [tooltipContent, setTooltipContent] = useState('');

  // State name to abbreviation mapping
  const stateNameToAbbr: Record<string, string> = {
    "Alabama": "AL", "Alaska": "AK", "Arizona": "AZ", "Arkansas": "AR",
    "California": "CA", "Colorado": "CO", "Connecticut": "CT", "Delaware": "DE",
    "Florida": "FL", "Georgia": "GA", "Hawaii": "HI", "Idaho": "ID",
    "Illinois": "IL", "Indiana": "IN", "Iowa": "IA", "Kansas": "KS",
    "Kentucky": "KY", "Louisiana": "LA", "Maine": "ME", "Maryland": "MD",
    "Massachusetts": "MA", "Michigan": "MI", "Minnesota": "MN", "Mississippi": "MS",
    "Missouri": "MO", "Montana": "MT", "Nebraska": "NE", "Nevada": "NV",
    "New Hampshire": "NH", "New Jersey": "NJ", "New Mexico": "NM", "New York": "NY",
    "North Carolina": "NC", "North Dakota": "ND", "Ohio": "OH", "Oklahoma": "OK",
    "Oregon": "OR", "Pennsylvania": "PA", "Rhode Island": "RI", "South Carolina": "SC",
    "South Dakota": "SD", "Tennessee": "TN", "Texas": "TX", "Utah": "UT",
    "Vermont": "VT", "Virginia": "VA", "Washington": "WA", "West Virginia": "WV",
    "Wisconsin": "WI", "Wyoming": "WY"
  };
  
  // Abbreviation to state name mapping for reverse lookup
  const abbrToStateName: Record<string, string> = {};
  Object.entries(stateNameToAbbr).forEach(([name, abbr]) => {
    abbrToStateName[abbr] = name;
  });

  const getStateValue = (stateId: string) => {
    // Try to find by full state name
    let stateData = data.find(d => d.state === stateId);
    
    // If not found by name, try by abbreviation
    if (!stateData && stateNameToAbbr[stateId]) {
      stateData = data.find(d => d.state === stateNameToAbbr[stateId]);
    }
    
    // If still not found and it might be an abbreviation itself, try the reverse lookup
    if (!stateData && abbrToStateName[stateId]) {
      stateData = data.find(d => d.state === stateId || d.state === abbrToStateName[stateId]);
    }
    
    return stateData ? stateData.value : 0;
  };

  const getStateColor = (stateId: string) => {
    // Try to find by full state name
    let stateData = data.find(d => d.state === stateId);
    
    // If not found by name, try by abbreviation
    if (!stateData && stateNameToAbbr[stateId]) {
      stateData = data.find(d => d.state === stateNameToAbbr[stateId]);
    }
    
    // If still not found and it might be an abbreviation itself, try the reverse lookup
    if (!stateData && abbrToStateName[stateId]) {
      stateData = data.find(d => d.state === stateId || d.state === abbrToStateName[stateId]);
    }
    
    if (!stateData) return "#EEE";
    
    // Calculate color intensity based on value
    const value = stateData.value;
    const maxValue = Math.max(...data.map(d => d.value));
    const opacity = maxValue > 0 ? value / maxValue : 0;
    
    // Use blue color with opacity
    // Get the rgb components of #3b82f6 (blue)
    const r = 59;
    const g = 130;
    const b = 246;
    
    // Calculate the color with opacity
    return `rgba(${r}, ${g}, ${b}, ${opacity.toFixed(2)})`;
  };

  return (
    <div className="w-full h-full relative">
      <ComposableMap 
        projection="geoAlbersUsa" 
        projectionConfig={{ scale: 900 }}
        style={{ width: "100%", height: "100%" }}
      >
        <ZoomableGroup>
          <Geographies geography={geoUrl}>
            {({ geographies }: { geographies: any[] }) =>
              geographies.map((geo: any) => {
                const stateId = geo.properties.name;
                const value = getStateValue(stateId);
                
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={getStateColor(stateId)}
                    stroke="#FFFFFF"
                    strokeWidth={0.5}
                    style={{
                      default: { outline: 'none' },
                      hover: { outline: 'none', fill: "#3b82f6" },
                      pressed: { outline: 'none' }
                    }}
                    onMouseEnter={() => {
                      setTooltipContent(`${stateId}: ${value}`);
                    }}
                    onMouseLeave={() => {
                      setTooltipContent('');
                    }}
                  />
                );
              })
            }
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>
      {tooltipContent && (
        <div className="absolute bg-white p-2 rounded shadow-md text-sm border border-gray-200 z-10 top-0 right-0 mt-2 mr-2">
          {tooltipContent}
        </div>
      )}
      
      {/* Legend */}
      <div className="absolute bottom-0 right-0 bg-white p-2 rounded-tl-md shadow-md text-xs border border-gray-200 mb-0 mr-0">
        <div className="flex items-center">
          <div className="w-full">
            <div className="flex justify-between mb-1">
              <span>Low</span>
              <span>High</span>
            </div>
            <div className="h-2 w-32 bg-gradient-to-r from-blue-100 to-blue-500 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
};