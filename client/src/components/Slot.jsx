import React from 'react';
import { useSlot } from '../core/SlotRegistry';

export const Slot = ({ name, context, fallback = null, className = "" }) => {
    const { registry } = useSlot();
    const items = registry[name] || [];

    if (items.length === 0) return fallback;

    return (
        <>
            {items.sort((a, b) => (a.order || 0) - (b.order || 0)).map(item => {
                const Component = item.component;
                return (
                    <Component
                        key={item.id}
                        {...item.props}
                        context={context}
                    />
                );
            })}
        </>
    );
};

export default Slot;
