import { motion } from 'framer-motion'

export function IconPhoneRotate(props: (typeof motion.svg)['defaultProps']) {
  return (
    <motion.svg
      className="h-6 w-6"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      initial={{ rotateZ: 0 }}
      animate={{ rotateZ: 80 }}
      transition={{
        duration: 1,
        ease: 'easeInOut',
        repeat: Infinity,
        repeatType: 'reverse',
        repeatDelay: 0.5,
      }}
      {...props}
    >
      <path
        fill="currentColor"
        d="m18.444 19.122l.53.53l-.53-.53Zm-8.14 0l.53-.53l-.53.53Zm8.818-8.818l-.53.53l.53-.53Zm0 8.14l-.53-.53l.53.53ZM22 14.374h.75H22ZM5.556 4.878l.53.53l-.53-.53Zm8.14 0l.53-.53l-.53.53ZM9.626 2v.75V2ZM4.878 5.556l-.53-.53l.53.53Zm0 8.14l-.53.53l.53-.53ZM2 9.626h-.75H2Zm7.478-3.54a.75.75 0 0 0-1.06-1.06l1.06 1.06ZM5.026 8.418a.75.75 0 1 0 1.06 1.061l-1.06-1.06Zm.382-2.33l.678-.679l-1.06-1.06l-.679.678l1.061 1.06Zm7.757-.679l5.427 5.427l1.06-1.061l-5.426-5.427l-1.06 1.061Zm5.427 12.506l-.678.678l1.06 1.06l.678-.678l-1.06-1.06Zm-7.757.678l-5.427-5.427l-1.06 1.061l5.426 5.426l1.06-1.06Zm7.079 0c-.975.974-1.653 1.65-2.232 2.092c-.562.429-.942.566-1.308.566v1.5c.826 0 1.522-.343 2.217-.873c.678-.517 1.439-1.28 2.383-2.224l-1.06-1.061Zm-8.14 1.06c.944.945 1.705 1.707 2.383 2.225c.695.53 1.391.873 2.217.873v-1.5c-.366 0-.745-.137-1.308-.566c-.579-.442-1.257-1.118-2.231-2.092l-1.061 1.06Zm8.818-8.817c.974.974 1.65 1.652 2.092 2.231c.429.563.566.942.566 1.308h1.5c0-.826-.343-1.522-.873-2.217c-.517-.678-1.28-1.439-2.224-2.383l-1.061 1.06Zm1.06 8.14c.945-.945 1.707-1.706 2.225-2.384c.53-.695.873-1.391.873-2.217h-1.5c0 .366-.137.746-.566 1.308c-.442.579-1.118 1.257-2.092 2.232l1.06 1.06ZM6.086 5.407c.975-.974 1.653-1.65 2.232-2.092c.562-.429.942-.566 1.308-.566v-1.5c-.826 0-1.522.343-2.217.873c-.679.518-1.439 1.28-2.383 2.224l1.06 1.061Zm8.14-1.06c-.944-.945-1.705-1.707-2.383-2.225c-.695-.53-1.391-.873-2.217-.873v1.5c.366 0 .745.137 1.308.566c.579.442 1.257 1.118 2.231 2.092l1.061-1.06Zm-9.879.678c-.944.944-1.706 1.704-2.224 2.383c-.53.695-.873 1.391-.873 2.217h1.5c0-.366.137-.746.566-1.308c.442-.579 1.118-1.257 2.092-2.232l-1.06-1.06Zm1.061 8.14c-.974-.975-1.65-1.653-2.092-2.232c-.429-.563-.566-.942-.566-1.308h-1.5c0 .826.343 1.522.873 2.217c.518.678 1.28 1.439 2.224 2.383l1.061-1.06Zm3.01-8.14L5.025 8.417l1.06 1.061l3.392-3.391l-1.06-1.061Zm7.8 10.218a.689.689 0 0 1 0 .974l1.06 1.06a2.189 2.189 0 0 0 0-3.095l-1.06 1.06Zm0 .974a.689.689 0 0 1-.974 0l-1.061 1.06c.855.856 2.24.856 3.096 0l-1.061-1.06Zm-.974 0a.689.689 0 0 1 0-.974l-1.061-1.06a2.189 2.189 0 0 0 0 3.095l1.06-1.06Zm0-.974a.689.689 0 0 1 .974 0l1.06-1.06a2.189 2.189 0 0 0-3.095 0l1.06 1.06Z"
      />
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M20.5 6.986L22 8c0-3.015-2.162-5.517-5-6M3.5 17.014L2 16c0 3.015 2.162 5.517 5 6"
      />
    </motion.svg>
  )
}
export default IconPhoneRotate
