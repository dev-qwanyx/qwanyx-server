import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

/**
 * Kill any process using the specified port
 */
export async function cleanupPort(port: number): Promise<void> {
  console.log(`🧹 Checking if port ${port} is in use...`)
  
  try {
    if (process.platform === 'win32') {
      // Windows
      try {
        const { stdout } = await execAsync(`netstat -ano | findstr :${port}`)
        const lines = stdout.trim().split('\n')
        
        for (const line of lines) {
          const parts = line.trim().split(/\s+/)
          const pid = parts[parts.length - 1]
          
          if (pid && pid !== '0') {
            console.log(`  Found process ${pid} using port ${port}`)
            try {
              await execAsync(`taskkill /F /PID ${pid}`)
              console.log(`  ✅ Killed process ${pid}`)
            } catch (killError) {
              console.log(`  ⚠️  Could not kill process ${pid}`)
            }
          }
        }
      } catch (error) {
        // No process found on port - that's good!
        console.log(`  ✅ Port ${port} is free`)
      }
    } else {
      // Unix/Linux/Mac
      try {
        const { stdout } = await execAsync(`lsof -ti:${port}`)
        const pids = stdout.trim().split('\n').filter(Boolean)
        
        for (const pid of pids) {
          console.log(`  Found process ${pid} using port ${port}`)
          try {
            await execAsync(`kill -9 ${pid}`)
            console.log(`  ✅ Killed process ${pid}`)
          } catch (killError) {
            console.log(`  ⚠️  Could not kill process ${pid}`)
          }
        }
      } catch (error) {
        // No process found on port - that's good!
        console.log(`  ✅ Port ${port} is free`)
      }
    }
    
    // Give the OS a moment to release the port
    await new Promise(resolve => setTimeout(resolve, 1000))
    
  } catch (error) {
    console.error('Error during port cleanup:', error)
  }
}

/**
 * Gracefully handle port in use errors
 */
export function handlePortError(error: any, port: number): void {
  if (error.code === 'EADDRINUSE') {
    console.error(`\n❌ Port ${port} is already in use!`)
    console.log(`\nTo fix this, run one of these commands:`)
    
    if (process.platform === 'win32') {
      console.log(`\nWindows PowerShell:`)
      console.log(`  Get-Process -Id (Get-NetTCPConnection -LocalPort ${port}).OwningProcess | Stop-Process -Force`)
      console.log(`\nCommand Prompt:`)
      console.log(`  for /f "tokens=5" %a in ('netstat -ano ^| findstr :${port}') do taskkill /F /PID %a`)
    } else {
      console.log(`\nUnix/Linux/Mac:`)
      console.log(`  kill -9 $(lsof -ti:${port})`)
    }
    
    console.log(`\nOr simply run: npm run brain:restart`)
    process.exit(1)
  } else {
    throw error
  }
}