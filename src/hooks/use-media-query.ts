import { useEffect, useState } from "react"

/** FinAi Resmi Mobil Telefon Ekran Standardı Eşiği (700px) */
export const FINAI_MOBILE_BREAKPOINT = 700

export function useMediaQuery(query: string) {
    const [value, setValue] = useState(false)

    useEffect(() => {
        if (typeof window === "undefined" || !window.matchMedia) return

        const result = window.matchMedia(query)
        function onChange(event: MediaQueryListEvent) {
            setValue(event.matches)
        }

        result.addEventListener("change", onChange)
        setValue(result.matches)

        return () => result.removeEventListener("change", onChange)
    }, [query])

    return value
}

/**
 * FinAi Standart Mobil Telefon Kancası (0px - 700px arası mobil telefon arayüzü)
 */
export function useIsMobile(breakpoint = FINAI_MOBILE_BREAKPOINT) {
    return useMediaQuery(`(max-width: ${breakpoint}px)`)
}
