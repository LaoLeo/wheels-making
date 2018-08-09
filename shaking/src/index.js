~function (global) {
    let SHAKE_SPEED_THRESHOLD = 300
    let lastTime = 0
    let x = y = z = lastx = lasty = lastz = 0

    global.motionHandler = function (shakingHandler) {

        return function (evt) {
            // 获取移动事件的位置信息（包含重力加速）
            let acceleration = evt.accelerationIncludingGravity
            let curTime = Date.now()
            let diffTime = curTime - lastTime

            // 限流，避免频繁调用
            if (diffTime > 120) {
                x = acceleration.x
                y = acceleration.y
                z = acceleration.z

                let speed = Math.abs(x + y + z - lastx - lasty - lastz) / diffTime * 1000
                if (speed > SHAKE_SPEED_THRESHOLD) {
                    shakingHandler()
                }

                lastx = x
                lasty = y
                lastz = z
                lastTime = curTime
            }
        }

    }
}(window)


if (window.DeviceMotionEvent) {
    window.addEventListener(
        'devicemotion',
        motionHandler(function () {
            alert('恭喜你中了一等奖！赶紧添加微信：laotuzhu303领取吧！')
        }), 
        false)
} else {
    alert('设备不支持位置感应')
}