export const breakpoints = {
    basic: 0,
    sm: 576,
    md: 768,
    lg: 992,
    xl: 1200,
    xxl: 1400,
};

export const dimensions = {
    containerWidth: 0,

    // should be consistent with the media query in TheHeader.vue
    headerHeightBreakpoint: breakpoints.md,

    headerHeightBasic: 60,
    headerHeight: 0,

    articleCrumbHeight: 60,
};

export const containerWidthPresets = {
    basic: 0, // should be innerWidth when assigned
    sm: 540,
    md: 720,
    lg: 960,
    xl: 1140,
    xxl: 1320,
};

export function getBreakpointName(): keyof typeof breakpoints {
    const breakpointNames = Object.keys(breakpoints);

    for (let i = 0; i < breakpointNames.length; i++) {
        const breakpointName = breakpointNames[i] as keyof typeof breakpoints;

        if (
            innerWidth >= breakpoints[breakpointName] &&
            (i === breakpointNames.length - 1 ||
                innerWidth < breakpoints[breakpointNames[i + 1] as keyof typeof breakpoints])
        ) {
            return breakpointName;
        }
    }

    return 'xxl';
}

function resize() {
    dimensions.headerHeight =
        innerWidth <= dimensions.headerHeightBreakpoint
            ? dimensions.headerHeightBasic * 2
            : dimensions.headerHeightBasic;

    const breakpointName = getBreakpointName();

    dimensions.containerWidth = breakpointName === 'basic' ? innerWidth : containerWidthPresets[breakpointName];
}

resize();

window.addEventListener('resize', resize);
