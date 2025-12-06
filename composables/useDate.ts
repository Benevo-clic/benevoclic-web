export const useDate = () => {
    const { t } = useI18n()

    /**
     * Format a date string or Date object to a localized string in 'Europe/Paris' timezone.
     * Default format is short date (e.g. 01/01/2023).
     */
    const parseDate = (date: string | Date | number): Date => {
        if (!date) return new Date()
        let d = date
        if (typeof d === 'string') {
            // Replace space with T if present (SQL compatible)
            d = d.replace(' ', 'T')
            // Add Z if missing timezone info
            if (!d.endsWith('Z') && !d.includes('+')) {
                d += 'Z'
            }
            return new Date(d)
        }
        return new Date(d)
    }

    /**
     * Format a date string or Date object to a localized string in 'Europe/Paris' timezone.
     * Default format is short date (e.g. 01/01/2023).
     */
    const formatDate = (date: string | Date | number, options: Intl.DateTimeFormatOptions = {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    }) => {
        if (!date) return ''
        const d = parseDate(date)
        return new Intl.DateTimeFormat('fr-FR', {
            timeZone: 'Europe/Paris',
            ...options
        }).format(d)
    }

    /**
     * Format time only (e.g. 14:00)
     */
    const formatTime = (date: string | Date | number) => {
        if (!date) return ''
        const d = parseDate(date)
        return new Intl.DateTimeFormat('fr-FR', {
            timeZone: 'Europe/Paris',
            hour: '2-digit',
            minute: '2-digit'
        }).format(d)
    }

    /**
     * Format relative time (e.g. "Il y a 2 heures", "À l'instant")
     * This is a simplified version, for more complex relative time use a library like luxon or date-fns if needed,
     * but here we keep it lightweight and timezone-aware by comparing timestamps.
     */
    const formatRelative = (dateString: string | Date | number): string => {
        if (!dateString) return ''

        // Ensure we are working with timestamps to avoid timezone confusion for the difference calculation
        const date = parseDate(dateString)
        const now = new Date()

        const diffMs = now.getTime() - date.getTime()
        const diffMins = Math.floor(diffMs / (1000 * 60))
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

        if (diffMins < 1) return t('date.just_now', "À l'instant")
        if (diffMins < 60) return t('date.minutes_ago', { count: diffMins }, `Il y a ${diffMins} min`)
        if (diffHours < 24) return t('date.hours_ago', { count: diffHours }, `Il y a ${diffHours} h`)
        if (diffDays < 7) return t('date.days_ago', { count: diffDays }, `Il y a ${diffDays} j`)

        return formatDate(date)
    }

    return {
        formatDate,
        formatTime,
        formatRelative
    }
}
