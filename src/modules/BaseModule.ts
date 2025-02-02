import { useModuleStore } from '../stores/useModuleStore'
import Logger from '../library/logger'
import { Istatus } from '../types/moduleStatus'

class BaseModule {
  /**
   * 模块名称，在被导出时定义
   *
   * 输出控制台日志时会用到
   */
  moduleName: string
  /**
   * 用于在控制台中输出日志信息
   */
  logger: Logger
  /**
   * 储存所有模块信息的 Pinia Store
   */
  moduleStore = useModuleStore()
  /**
   * 推荐添加一个 config 属性来表示当前模块的配置项
   *
   * @example this.moduleStore.moduleConfig.DailyTasks.MainSiteTasks.login
   */
  config?: any
  /**
   * 如果需要在控制面板上显示模块状态，推荐添加一个 status setter 用来设置模块状态
   *
   * @example
   * public set status(s: Istatus) {
   *    this.moduleStore.moduleStatus.DailyTasks.MainSiteTasks.login = s
   * }
   */

  set status(_s: Istatus) {
    throw new Error('Method not implemented.')
  }

  constructor(moduleName: string) {
    this.moduleName = moduleName
    this.logger = new Logger(this.moduleName)
  }

  run(): void {
    throw new Error('Method not implemented.')
  }
}

export default BaseModule
