import { ReactNode, useRef, useState, useCallback, useMemo, useEffect, memo } from "react";
import { throttle } from "lodash";

interface VirtualizedListProps<T> {
    items: T[];
    itemHeight: number;
    height: number;
    overscan: number;
    children: (item: T, index: number) => ReactNode;
}

const VirtualizedList = <T,>({ items, itemHeight, height, children, overscan = 5 }: VirtualizedListProps<T>) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [scrollTop, setScrollTop] = useState(0);

    const handleScroll = useCallback(
        throttle(() => {
            setScrollTop(containerRef.current?.scrollTop!);
        }, 16),
        []
    );

    const {
        visibleItems,
        offsetY,
        totalHeight
    } = useMemo(() => {
        const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
        const endIndex = Math.min(
            items.length - 1,
            Math.floor((scrollTop + height) / itemHeight) + overscan
        );
        return {
            visibleItems: items.slice(startIndex, endIndex + 1).map((item, index) => ({
                item,
                virtualIndex: startIndex + index,
            })),
            offsetY: startIndex * itemHeight,
            totalHeight: items.length * itemHeight
        };
    }, [scrollTop, items]);

    const containerStyle = useMemo(() => ({
        height: height || '400px',
        overflowX: 'hidden' as const,
        overflowY: 'auto' as const,
        display: 'flex',
        willChange: 'transform',
        transform: 'translate3d(0, 0, 0)',
    }), [height]);

    const itemsStyle = useMemo(() => ({
        display: 'flex',
        flexDirection: 'column' as const,
        gap: '25px',
        transform: `translate3d(0, ${offsetY}px, 0)`,
        willChange: 'transform',
    }), [offsetY]);

    const renderItem = useCallback((item: T, index: number) => {
        return (
            <div
                key={index}
                style={{
                    height: itemHeight || '100px',
                    display: 'flex',
                }}
            >
                {children(item, index)}
            </div>
        )
    }, [children, itemHeight]);

    useEffect(() => {
        const currentContainer = containerRef.current;
        currentContainer?.addEventListener('scroll', handleScroll);

        return () => {
            currentContainer?.removeEventListener('scroll', handleScroll);
        };
    }, [handleScroll]);

    return (
        <div
            ref={containerRef}
            style={containerStyle}
        >
            <div
                style={{
                    height: totalHeight,
                    position: 'relative'
                }}
            >
                <div
                    style={itemsStyle}
                >
                    {visibleItems.map(({item, virtualIndex}) => renderItem(item, virtualIndex))}
                </div>
            </div>
        </div>
    );
};

export default memo(VirtualizedList) as typeof VirtualizedList;