// 位置情報の検証ロジックをここに実装
function validateLocation(location) {
    // 例: 特定の範囲内にいるかどうか
    const [latitude, longitude] = location.split(',');
    // ここに具体的な範囲を設定します
    if (latitude > 35.0 && latitude < 36.0 && longitude > 139.0 && longitude < 140.0) {
        return true;
    }
    return false;
}

module.exports = validateLocation;