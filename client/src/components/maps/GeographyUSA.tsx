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

  const getStateValue = (stateId: string) => {
    const stateData = data.find(d => d.state === stateId);
    return stateData ? stateData.value : 0;
  };

  const getStateColor = (stateId: string) => {
    const stateData = data.find(d => d.state === stateId);
    if (!stateData) return "#EEE";
    
    // Calculate color intensity based on value
    const value = stateData.value;
    const maxValue = Math.max(...data.map(d => d.value));
    const opacity = maxValue > 0 ? value / maxValue : 0;
    
    // Parse the base color
    const baseColor = color;
    
    // Return with calculated opacity
    return `${baseColor}${Math.round(opacity * 100)}`;
  };

  return (
    <div className="w-full h-full">
      <ComposableMap projection="geoAlbersUsa" projectionConfig={{ scale: 1000 }}>
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
                      hover: { outline: 'none', fill: color },
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
        <div className="absolute bg-white p-2 rounded shadow text-sm">
          {tooltipContent}
        </div>
      )}
    </div>
  );
};