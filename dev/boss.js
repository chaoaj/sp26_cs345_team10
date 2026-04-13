
class Boss {
    constructor(x, y, target_x, target_y, r, spritedata, spritesheet, Anispeed, moveSpeed, health, shootSpeed) {
        this.x = x;
        this.y = y;
        this.target_x = target_x;
        this.target_y = target_y;
        this.spritedata = spritedata;
        this.spritesheet = spritesheet;
        this.Anispeed = Anispeed;
        this.hit = false;
        this.r = r // this r is scaleable in comparisson to the enemy class for big bosses
        this.moveSpeed = moveSpeed;
        this.health = health;
        this.shootSpeed = shootSpeed;
        this.can_hit = true;
        this.is_visible = true;
        this.is_shooting = false; // this is so the boss doesn't shoot like 1000 bullets every frame
        this.is_dead = false; // this is so the boss' projectiles stop shooting when dead

        this.Boss_anim = new BossSprite(spritedata, spritesheet, Anispeed, r * 2, r * 2);

        this.w = this.Boss_anim.width
        this.h = this.Boss_anim.height

        this.pos = createVector(x, y);
        this.vel = createVector(target_x - x, target_y - y);
        this.vel.setMag(3); // Speed
    }
}

class rockBoss extends Boss {
    constructor(x, y, target_x, target_y, r, spritedata, spritesheet, Anispeed, moveSpeed, health, shootSpeed) {
        super(x, y, target_x, target_y, r, spritedata, spritesheet, Anispeed, moveSpeed, health, shootSpeed)

        this.wanderAngle = random(TWO_PI);
        this.shooting = Math.floor(Math.random() * shootSpeed);
    }

    update(player) {
        if (!paused) {
            this.shootToptoBottom(player); // this will start the shooting cycle. the way this works is jank if need be ask me - Kai
        }
    }

    draw() {
        if (this.is_visible === true) {
            fill(0, 0, 0);
            circle(this.pos.x, this.pos.y, this.r * 2); // this is for showing the hitbox in testing.
            this.Boss_anim.show(this.pos.x - this.r, this.pos.y - this.r);
            this.Boss_anim.animate();
        }
    }

    async invincible() {
        this.can_hit = false;
        this.blink();
        console.log("cant hit me!");
        await delay(1000); // this is 1 seconds delay, change this and the for loop above to show change in blinking.
        this.can_hit = true;
    }

    async blink() { // this makes the boss blink when invincible
        for (let i = 0; i < 5; i++) { // until 5 because of the 2 delays and 1 second of i frames
            this.is_visible = false;
            await delay(100);
            this.is_visible = true;
            await delay(100);
        }
    }

    async shootToptoBottom(player) {
        let bottom = CANVAS_HEIGHT - 150; // this stops around the lower 1/4 of the screen
        if (this.is_shooting) {
            return;
        }
        this.is_shooting = true;
        for (let i = 0; i <= bottom; i += 50) {
            projectiles.push(new Projectile(this.pos.x, this.pos.y, player.pos.x, i, "rockShooter"));
            await delay(100);
        }
        await delay(2000); // 2 second delay;
        this.is_shooting = false;
        this.shootBottomtoTop(player);
    }

    async shootBottomtoTop(player) {
        let top = 150;
        if (this.is_shooting) {
            return;
        }
        this.is_shooting = true;
        for (let i = CANVAS_HEIGHT; i >= top; i -= 50) {
            projectiles.push(new Projectile(this.pos.x, this.pos.y, player.pos.x, i, "rockShooter"));
            await delay(100);
        }
        await delay(2000)
        this.is_shooting = false;
        this.shootCenter(player);
    }

    async shootCenter(player) {
        let center_top = (CANVAS_HEIGHT / 2) - 150;
        let center_bottom = (CANVAS_HEIGHT / 2) + 250;
        if (this.is_shooting) {
            return;
        }
        this.is_shooting = true;
        for (let i = center_top; i <= center_bottom; i += 20) {
            projectiles.push(new Projectile(this.pos.x, this.pos.y, player.pos.x, i, "rockShooter"));
            await delay(50);
        }
        await delay(2000);
        this.is_shooting = false;
    }
}