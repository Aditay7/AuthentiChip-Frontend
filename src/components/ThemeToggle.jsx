import { Moon, Sun } from 'lucide-react'
import { motion } from 'framer-motion'
import useAppStore from '../store/useAppStore'

const ThemeToggle = () => {
  const { theme, setTheme } = useAppStore()
  const isDark = theme === 'dark'

  const toggleTheme = () => {
    const newTheme = isDark ? 'light' : 'dark'
    setTheme(newTheme)
  }

  return (
    <motion.button
      onClick={toggleTheme}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`
        relative flex items-center justify-center w-12 h-12 rounded-xl
        transition-all duration-300 border
        ${isDark 
          ? 'bg-bg-card border-border-color text-yellow-400 hover:bg-bg-panel' 
          : 'bg-bg-card border-border-color text-slate-700 hover:bg-bg-panel'
        }
      `}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      <motion.div
        initial={false}
        animate={{ rotate: isDark ? 180 : 0 }}
        transition={{ duration: 0.3 }}
        className="flex items-center justify-center"
      >
        {isDark ? (
          <Sun className="w-5 h-5" />
        ) : (
          <Moon className="w-5 h-5" />
        )}
      </motion.div>
    </motion.button>
  )
}

export default ThemeToggle

