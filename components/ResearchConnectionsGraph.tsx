import React, { useRef, useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { researchLinesMap } from './data/research';
import type { ResearchArea, Product } from '../types';

interface ResearchConnectionsGraphProps {
    products: Product[];
}

// Helper to convert hex color to RGB object
const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
};

// Helper to convert RGB object to hex color string
const rgbToHex = (r: number, g: number, b: number) => {
    const toHex = (c: number) => ('0' + Math.round(c).toString(16)).slice(-2);
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

// Generates a color palette by interpolating between two colors
const generateColorPalette = (startColorHex: string, endColorHex: string, count: number): string[] => {
    if (count <= 1) return [startColorHex];
    
    const palette: string[] = [];
    const startRgb = hexToRgb(startColorHex);
    const endRgb = hexToRgb(endColorHex);

    for (let i = 0; i < count; i++) {
        const factor = i / (count - 1);
        const r = startRgb.r + factor * (endRgb.r - startRgb.r);
        const g = startRgb.g + factor * (endRgb.g - startRgb.g);
        const b = startRgb.b + factor * (endRgb.b - startRgb.b);
        palette.push(rgbToHex(r, g, b));
    }
    return palette;
};


const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInRadians: number) => ({
  x: centerX + radius * Math.cos(angleInRadians),
  y: centerY + radius * Math.sin(angleInRadians),
});

const describeThickArc = (x: number, y: number, innerRadius: number, outerRadius: number, startAngle: number, endAngle: number) => {
    const startOuter = polarToCartesian(x, y, outerRadius, startAngle);
    const endOuter = polarToCartesian(x, y, outerRadius, endAngle);
    const startInner = polarToCartesian(x, y, innerRadius, startAngle);
    const endInner = polarToCartesian(x, y, innerRadius, endAngle);
    const largeArcFlag = endAngle - startAngle >= Math.PI ? '1' : '0';

    const path = [
        "M", startOuter.x, startOuter.y,
        "A", outerRadius, outerRadius, 0, largeArcFlag, 1, endOuter.x, endOuter.y,
        "L", endInner.x, endInner.y,
        "A", innerRadius, innerRadius, 0, largeArcFlag, 0, startInner.x, startInner.y,
        "Z"
    ].join(" ");
    return path;
};

export const ResearchConnectionsGraph: React.FC<ResearchConnectionsGraphProps> = ({ products }) => {
    const svgContainerRef = useRef<HTMLDivElement>(null);
    const [dimensions, setDimensions] = useState({ width: 400, height: 400 });
    const [hoveredArea, setHoveredArea] = useState<ResearchArea | null>(null);

    useEffect(() => {
        const handleResize = () => {
            if (svgContainerRef.current) {
                const width = svgContainerRef.current.offsetWidth;
                setDimensions({
                    width: width,
                    height: width, // Keep it square
                });
            }
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const { areaData, ribbons } = useMemo(() => {
        if (!products || products.length === 0) {
            return { areaData: [], ribbons: [] };
        }
        
        const coreResearchAreas = Object.values(researchLinesMap).filter(line => line.id !== 'Scholarship of Teaching & Learning');

        const productCounts: Record<string, number> = {};
        coreResearchAreas.forEach(a => productCounts[a.id] = 0);
        products.forEach(p => {
            p.researchAreas?.forEach(areaId => {
                if (productCounts.hasOwnProperty(areaId)) {
                    productCounts[areaId]++;
                }
            });
        });

        const areas = coreResearchAreas.filter(a => productCounts[a.id] > 0);
        const areaIndexMap = new Map(areas.map((area, i) => [area.id, i]));
        
        const links: { source: ResearchArea; target: ResearchArea; key: string }[] = [];
        products.forEach((product) => {
            const productAreas = product.researchAreas?.filter(area => areaIndexMap.has(area));
            if (productAreas && productAreas.length > 1) {
                for (let i = 0; i < productAreas.length; i++) {
                    for (let j = i + 1; j < productAreas.length; j++) {
                        links.push({
                            source: productAreas[i],
                            target: productAreas[j],
                            key: `${product.doi}-${i}-${j}`,
                        });
                    }
                }
            }
        });
        
        const totalProductsCount = Object.values(productCounts).reduce((sum, count) => sum + count, 0);
        if(totalProductsCount === 0) return { areaData: [], ribbons: [] };

        const palette = generateColorPalette('#FBBF24', '#1F2937', areas.length);

        const gapAngle = 0.04; 
        const totalGapSpace = areas.length * gapAngle;
        const availableCircumference = 2 * Math.PI - totalGapSpace;
        
        let currentAngle = -Math.PI / 2 + gapAngle/2;
        const processedAreaData = areas.map((area, i) => {
            const angleSpan = (productCounts[area.id] / totalProductsCount) * availableCircumference;
            const startAngle = currentAngle;
            const endAngle = startAngle + angleSpan;
            currentAngle = endAngle + gapAngle;
            return { ...area, startAngle, endAngle, color: palette[i] };
        });

        const connectionCounts: Record<string, number> = {};
        const currentConnectionIndex: Record<string, number> = {};
        areas.forEach(a => {
            connectionCounts[a.id] = 0;
            currentConnectionIndex[a.id] = 0;
        });

        links.forEach(link => {
            connectionCounts[link.source]++;
            connectionCounts[link.target]++;
        });
        
        const { width, height } = dimensions;
        const centerX = width / 2;
        const centerY = height / 2;
        
        const outerRadius = Math.max(10, Math.min(width, height) / 2 - 20);
        const innerRadius = Math.max(5, outerRadius - 15);

        const processedRibbons = links.map(link => {
            const sourceArea = processedAreaData.find(a => a.id === link.source);
            const targetArea = processedAreaData.find(a => a.id === link.target);

            if (!sourceArea || !targetArea) return null;

            const sourceAngleSpan = sourceArea.endAngle - sourceArea.startAngle;
            const sourceAngle = sourceArea.startAngle + (sourceAngleSpan * (currentConnectionIndex[link.source] + 0.5)) / connectionCounts[link.source];
            currentConnectionIndex[link.source]++;
            
            const targetAngleSpan = targetArea.endAngle - targetArea.startAngle;
            const targetAngle = targetArea.startAngle + (targetAngleSpan * (currentConnectionIndex[link.target] + 0.5)) / connectionCounts[link.target];
            currentConnectionIndex[link.target]++;

            const start = polarToCartesian(centerX, centerY, innerRadius, sourceAngle);
            const end = polarToCartesian(centerX, centerY, innerRadius, targetAngle);

            const path = `M ${start.x},${start.y} Q ${centerX},${centerY} ${end.x},${end.y}`;
            
            return { ...link, path };
        }).filter((r): r is NonNullable<typeof r> => r !== null);

        return { areaData: processedAreaData, ribbons: processedRibbons };

    }, [products, dimensions]);

    const { width, height } = dimensions;
    const centerX = width / 2;
    const centerY = height / 2;
    const outerRadius = Math.max(10, Math.min(width, height) / 2 - 20);
    const innerRadius = Math.max(5, outerRadius - 15);

    if (areaData.length === 0) {
        return <div style={{ minHeight: 400 }} className="flex items-center justify-center text-brand-gray">No connections to display.</div>;
    }

    return (
        <div className="w-full">
            <div className="lg:grid lg:grid-cols-2 lg:gap-12 lg:items-center">
                <div ref={svgContainerRef} className="w-full max-w-lg mx-auto">
                    <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`}>
                        <g>
                            {ribbons.map((ribbon) => {
                                const isDimmed = hoveredArea && hoveredArea !== ribbon.source && hoveredArea !== ribbon.target;
                                return (
                                    <motion.path
                                        key={ribbon.key}
                                        d={ribbon.path}
                                        fill="none"
                                        stroke="#4a5568"
                                        strokeWidth="1"
                                        // FIX: Spread motion props to avoid TypeScript type errors.
                                        {...{
                                            initial: { opacity: 0 },
                                            animate: { opacity: isDimmed ? 0.03 : 0.2 },
                                            transition: { duration: 0.3 },
                                        }}
                                    />
                                );
                            })}
                        </g>
                        <g>
                            {areaData.map((area) => {
                                const isDimmed = hoveredArea && hoveredArea !== area.id;
                                return (
                                    <motion.g
                                        key={area.id}
                                        onMouseEnter={() => setHoveredArea(area.id)}
                                        onMouseLeave={() => setHoveredArea(null)}
                                        // FIX: Spread motion props to avoid TypeScript type errors.
                                        {...{
                                            animate: { opacity: isDimmed ? 0.3 : 1 },
                                            transition: { duration: 0.3 },
                                        }}
                                        className="cursor-pointer"
                                    >
                                        <path
                                            d={describeThickArc(centerX, centerY, innerRadius, outerRadius, area.startAngle, area.endAngle)}
                                            fill={area.color}
                                        />
                                    </motion.g>
                                );
                            })}
                        </g>
                    </svg>
                </div>
                <div className="mt-8 lg:mt-0">
                    <h2 className="text-3xl font-bold tracking-tight text-brand-dark text-center lg:text-left">Interdisciplinary Research Network</h2>
                    <p className="mt-4 text-brand-gray leading-relaxed text-center lg:text-left max-w-3xl mx-auto lg:mx-0">
                        This visualization maps the connections between my core research areas. Each colored arc represents a research area, with its size proportional to the total number of publications. Each thin, grey line represents a single publication that bridges two fields, illustrating the web of interdisciplinary collaboration. Hover over an arc or legend item to highlight its specific connections.
                    </p>
                    <div className="mt-8">
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-1 gap-y-3 gap-x-4">
                            {areaData.map(area => (
                                <div 
                                    key={area.id} 
                                    className="flex items-center space-x-3 p-2 rounded-lg transition-colors duration-200 hover:bg-zinc-100 cursor-pointer"
                                    onMouseEnter={() => setHoveredArea(area.id)}
                                    onMouseLeave={() => setHoveredArea(null)}
                                >
                                    <div className="w-4 h-4 rounded-full flex-shrink-0" style={{ backgroundColor: area.color }}></div>
                                    <span className="text-sm text-brand-dark font-medium">{area.title}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};