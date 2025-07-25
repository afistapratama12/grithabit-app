import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    mql.addEventListener("change", onChange)
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isMobile
}

// Enhanced mobile detection with user agent and touch capability
export function useMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean>(false);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);

  React.useEffect(() => {
    function detectMobile(): boolean {
      if (typeof window === "undefined") return false;
      
      // Check user agent
      const userAgent = navigator.userAgent;
      const mobileKeywords = [
        'Mobile', 'Android', 'iPhone', 'iPad', 'iPod', 
        'BlackBerry', 'Windows Phone', 'webOS'
      ];
      
      const isMobileUA = mobileKeywords.some(keyword => userAgent.includes(keyword));
      
      // Check screen size as backup
      const isMobileScreen = window.innerWidth <= MOBILE_BREAKPOINT;
      
      // Check for touch capability
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      
      return isMobileUA || (isMobileScreen && isTouchDevice);
    }

    // Initial check
    setIsMobile(detectMobile());
    setIsLoading(false);

    // Listen for resize events
    const handleResize = () => {
      setIsMobile(detectMobile());
    };

    window.addEventListener('resize', handleResize);
    
    // Listen for orientation change on mobile devices
    window.addEventListener('orientationchange', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  return { isMobile, isLoading };
}

// Hook to redirect based on device type
export function useDeviceRedirect() {
  const { isMobile, isLoading } = useMobile();

  React.useEffect(() => {
    if (isLoading) return;

    const currentPath = window.location.pathname;
    
    // Redirect mobile users from desktop route
    if (isMobile && currentPath.startsWith('/dashboard')) {
      window.location.href = '/app';
    }
    
    // Redirect desktop users from mobile route
    if (!isMobile && currentPath.startsWith('/app')) {
      window.location.href = '/dashboard';
    }
  }, [isMobile, isLoading]);

  return { isMobile, isLoading };
}
