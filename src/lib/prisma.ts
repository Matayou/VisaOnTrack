// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare global {
  // eslint-disable-next-line no-var
  var prisma: any
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let prisma: any

if (typeof window === 'undefined') {
  if (process.env.NODE_ENV === 'production') {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    prisma = new (require('@prisma/client') as any).PrismaClient()
  } else {
    if (!global.prisma) {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      global.prisma = new (require('@prisma/client') as any).PrismaClient()
    }
    prisma = global.prisma
  }
}

export default prisma