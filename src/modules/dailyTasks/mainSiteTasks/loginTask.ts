import BaseModule from '../../BaseModule'
import { isTimestampToday, delayToNextMoment, tsm, isNowIn } from '../../../library/luxon'
import { useBiliStore } from '../../../stores/useBiliStore'
import { Istatus } from '../../../types/moduleStatus'

class LoginTask extends BaseModule {
  config = this.moduleStore.moduleConfig.DailyTasks.MainSiteTasks.login

  set status(s: Istatus) {
    this.moduleStore.moduleStatus.DailyTasks.MainSiteTasks.login = s
  }

  private async login() {
    // 触发每日登录任务的请求是 BAPI.main.nav
    // 这个请求脚本在默认模块 biliInfo 中每天都会发送
    // 而且打开任意B站页面的时候都会有这个请求
    // 所以直接当作是完成了
    this.logger.log('每日登录任务已完成')
    // 记录当前时间戳
    this.config._lastCompleteTime = tsm()
    this.status = 'done'
    return Promise.resolve()
  }

  public async run() {
    this.logger.log('每日登录模块开始运行')
    // 开启了每日登录
    if (this.config.enabled) {
      const biliStore = useBiliStore()
      // 上一次完成每日登录任务的时间不在今天
      if (!isTimestampToday(this.config._lastCompleteTime)) {
        this.status = 'running'
        // 每日登录任务未完成
        if (biliStore.dailyRewardInfo && !biliStore.dailyRewardInfo.login) {
          await this.login()
        } else {
          // 用户在运行脚本前已经完成了任务，也记录完成时间
          this.config._lastCompleteTime = tsm()
          this.status = 'done'
        }
      } else {
        if (!isNowIn(0, 0, 0, 5)) {
          this.logger.log('今天已经完成过每日登录任务了')
          this.status = 'done'
        } else {
          this.logger.log('昨天的每日登录任务已经完成过了，等到今天的00:05再执行')
        }
      }
    }

    // 明天半夜再运行
    const diff = delayToNextMoment()
    setTimeout(() => this.run(), diff.ms)
    this.logger.log('距离每日登录模块下次运行时间:', diff.str)
  }
}

export default LoginTask
