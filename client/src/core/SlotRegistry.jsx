import React, { createContext, useContext, useState, useEffect } from 'react';

const SlotContext = createContext();

export const SlotProvider = ({ children }) => {
    // Registry: { [slotName]: [ { id, component, order, props } ] }
    const [registry, setRegistry] = useState({});

    const registerComponent = (slotName, component, options = {}) => {
        setRegistry(prev => {
            const currentSlots = prev[slotName] || [];
            // Avoid duplicates
            if (currentSlots.find(s => s.id === options.id)) return prev;

            return {
                ...prev,
                [slotName]: [
                    ...currentSlots,
                    {
                        component,
                        id: options.id || Math.random().toString(36).substr(2, 9),
                        order: options.order || 10,
                        props: options.props || {}
                    }
                ].sort((a, b) => a.order - b.order)
            };
        });
    };

    const unregisterComponent = (slotName, id) => {
        setRegistry(prev => ({
            ...prev,
            [slotName]: (prev[slotName] || []).filter(item => item.id !== id)
        }));
    };

    return (
        <SlotContext.Provider value={{ registry, registerComponent, unregisterComponent }}>
            {children}
        </SlotContext.Provider>
    );
};

export const useSlot = () => useContext(SlotContext);

// Plugin Loader Component to register addons on mount
export const AddonLoader = ({ addons }) => {
    const { registerComponent } = useSlot();

    useEffect(() => {
        addons.forEach(addon => {
            if (addon.init) addon.init({ registerComponent });
        });
    }, []); // Run once on mount

    return null;
};
