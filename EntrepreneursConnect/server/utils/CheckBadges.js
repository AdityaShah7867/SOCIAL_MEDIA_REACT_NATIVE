
const badges = async (user) => {
    if (user.points > 200) {
        user.badges = ['Expert'];
    } else if (user.points > 100) {
        user.badges = ['Advanced'];
    } else if (user.points > 50) {
        user.badges = ['Intermediate'];
    } else if (user.points > 10) {
        user.badges = ['Beginner'];
    } else {
        user.badges = [];
    }

    await user.save();
};


module.exports = {
    badges
};