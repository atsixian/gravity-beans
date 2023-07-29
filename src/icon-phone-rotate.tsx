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
        fillRule="evenodd"
        d="M2 9.626c0 1.192.96 2.151 2.878 4.07l5.426 5.426C12.223 21.041 13.182 22 14.374 22c1.192 0 2.151-.96 4.07-2.878l.678-.678C21.041 16.526 22 15.566 22 14.374c0-1.192-.96-2.151-2.878-4.07l-5.426-5.426C11.777 2.959 10.818 2 9.626 2c-1.192 0-2.151.96-4.07 2.878l-.678.678C2.959 7.475 2 8.434 2 9.626Zm7.478-3.539a.75.75 0 0 0-1.06-1.06l-3.392 3.39a.75.75 0 0 0 1.06 1.062l3.392-3.392Zm7.27 10.662a1.44 1.44 0 1 0-2.035-2.035a1.44 1.44 0 0 0 2.035 2.035ZM16.26 1.874a.75.75 0 0 1 .866-.613c3.2.544 5.624 3.36 5.624 6.74a.75.75 0 0 1-1.17.62l-1.5-1.014a.75.75 0 1 1 .84-1.242l.1.067c-.577-1.91-2.18-3.358-4.146-3.693a.75.75 0 0 1-.613-.865ZM7.74 22.126a.75.75 0 0 1-.866.613C3.674 22.195 1.25 19.38 1.25 16a.75.75 0 0 1 1.17-.621l1.5 1.014a.75.75 0 0 1-.84 1.242l-.1-.067c.577 1.91 2.18 3.358 4.146 3.693a.75.75 0 0 1 .613.865Z"
        clipRule="evenodd"
      ></path>
    </motion.svg>
  )
}
export default IconPhoneRotate
