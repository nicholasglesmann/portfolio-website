class MidnightSky {

    constructor() {
        this.$canvas = document.getElementById("canvas");
        this.$context = this.$canvas.getContext("2d");

        this.numStars = this.calculateNumStars(window.innerWidth);
        this.distance = this.calculateDistance(window.innerWidth);

        this.defaultStar = {
            starProps: {
                color: 'rgba(238, 238, 238, .5)',
                width: 1,
                randomWidth: true
            },
            line: {
                color: 'rgba(238, 238, 238, .5)',
                width: 0.2
            },
            position: {
                x: 0,
                y: 0
            },
            width: window.innerWidth,
            height: window.innerHeight,
            velocity: 0.8,
            numStars: this.numStars,
            distance: this.distance,
            radius: 120,
            stars: []
        }
        //copies the default object to the config object
        this.config = JSON.parse(JSON.stringify(this.defaultStar));

        /////////////Method Bindings//////////////////
        this.setCanvas = this.setCanvas.bind(this);
        this.setContext = this.setContext.bind(this);
        this.setInitialPosition = this.setInitialPosition.bind(this);
        this.createStar = this.createStar.bind(this);
        this.createStars = this.createStars.bind(this);
        this.drawStar = this.drawStar.bind(this);
        this.drawStars = this.drawStars.bind(this);
        this.moveStar = this.moveStar.bind(this);
        this.moveStars = this.moveStars.bind(this);
        this.animateStars = this.animateStars.bind(this);
        this.addEventListener = this.addEventListener.bind(this);
        this.highlight = this.highlight.bind(this);
        this.drawLines = this.drawLines.bind(this);

        /////////Starting Methods//////////////////
        this.setCanvas();
        this.setContext();
        this.setInitialPosition();
        this.createStars();
        this.drawStars();
        this.addEventListener();

        //starts animation, 60 fps
        this.animation = window.setInterval(this.animateStars, 16.666666);
    }

    calculateNumStars(width) {
        if(width <= 500) // Smartphones
            return 35;
        if(width <= 768) // Tablets
            return 75;
        return 100; // Computers
    }

    calculateDistance(width) {
        if(width <= 500) // Smartphones
            return 100;
        if(width <= 768) // Tablets
            return 150;
        return 200; // Computers
    }

    addEventListener() {
        this.$canvas.addEventListener("mousemove", e => {this.highlight(e)});
    }

    setCanvas() {
        //sets canvas height and width to the window height and width
        this.$canvas.height = this.config.height;
        this.$canvas.width = this.config.width;
    }

    setContext() {
        this.$context.strokeStyle = this.config.starProps.color;
        this.$context.fillStyle = this.config.starProps.color;
        this.$context.lineWidth = this.config.starProps.width;
    }

    setInitialPosition() {
        this.config.position.x = this.config.width / 2;
        this.config.position.y = this.config.height / 2; 
    }

    createStar() {
        //creates a new star object using this.defaultStar as a template
        let newStar = JSON.parse(JSON.stringify(this.defaultStar));

        //sets random start position based on window height and width
        newStar.position.x = Math.floor((Math.random() * (this.config.width - 1)));
        newStar.position.y = Math.floor((Math.random() * (this.config.height - 1)));

        //sets a random x and y velocity
        newStar.vx = Math.random() / 3;
        newStar.vy = Math.random() / 3;
        
        //randomly sets the velocity positive or negative
        newStar.vx *= (Math.random() > .5) ? 1 : -1;
        newStar.vy *= (Math.random() > .5) ? 1 : -1;
    
        //sets a random radius
        newStar.radius = Math.random() * 10;

        //sets a random width (1 or 2)
        newStar.starProps.width = Math.ceil(Math.random() * 10) / 10;
       
        //sets a random alpha
        let alpha = (Math.floor((Math.random() * 100) + 1)) / 200;

        //creates a new property to store the alpha
        newStar.starProps.alpha = alpha;

        //sets the star starting color based on the alpha
        newStar.starProps.color = "rgba(238, 238, 238, " + alpha + ")";
        
        //randomly sets the fade in value to true or false
        if (Math.random() > .5) {
            newStar.fadeIn = true;
        } else {
            newStar.fadeIn = false;
        }

        return newStar;
    }

    createStars() {
        //creates all the stars
        for(let i = 0; i <= this.config.numStars; i++) {
            this.config.stars.push(this.createStar());
        }
    }

    drawStar(star) {
        // gets the current alpha for the star
        let alpha = star.starProps.alpha;

        //changes the fade in value if necessary
        if(alpha <= .1) {
            star.fadeIn = true;
        } else if (alpha >= .7) {
            star.fadeIn = false;
        }

        //update the alpha value
        if(star.fadeIn) {
            alpha += .007;
        } else {
            alpha -= .007;
        }

        //sets the new draw style to updated alpha
        this.$context.strokeStyle = "rgba(238, 238, 238, " + alpha + ")";
        this.$context.fillStyle = "rgba(238, 238, 238, " + alpha + ")";

        //updates the alpha in the star
        star.starProps.alpha = alpha;
        
        //draws the star
        this.$context.strokeRect(star.position.x, star.position.y, star.starProps.width, star.starProps.width);
        this.$context.fillRect(star.position.x, star.position.y, star.starProps.width, star.starProps.width);
    }

    drawStars() {
        //clears the canvas
        this.$context.clearRect(0, 0, this.config.width, this.config.height);

        //loops through the star array and draws every star
        for(let i = 0; i <= this.config.numStars; i++) {

            this.drawStar(this.config.stars[i]);
        }
    }

    moveStar(star) {
        //updates the star position
        star.position.x += star.vx;
        star.position.y += star.vy;

        //if the star position reaches the edge of the canvas, move it to the opposite side of the canvas
        star.position.x += (star.position.x < 0) ? star.width : 0;
        star.position.x -= (star.position.x > star.width) ? star.width : 0;
        star.position.y += (star.position.y < 0) ? star.height : 0;
        star.position.y -= (star.position.y > star.height) ? star.height : 0;
    }

    moveStars() {
        //loop through the star array and move every star
        for(let i = 0; i <= this.config.numStars; i++) {
            this.moveStar(this.config.stars[i]);
        }
    }

    animateStars() {
        this.$context.clearRect(0, 0, this.config.width, this.config.height);
        this.moveStars();
        this.drawStars();
        this.drawLines();
    }

    highlight(e) {
        //sets the position of the mouse
        this.config.position.x = e.pageX - this.$canvas.offsetLeft;
        this.config.position.y = e.pageY - this.$canvas.offsetTop;
    }

    drawLines() {
        //compare all combinations of two stars
        for (let i = 0; i < this.config.numStars; i++) {

            //the inner loop starts at i + 1 to eliminate any repeat star comparisions
            for (let j = i + 1; j < this.config.numStars; j++) {

                //gets two stars
                let iStar = this.config.stars[i];
                let jStar = this.config.stars[j];

                //if the stars are close enough to each other based on the config distance
                if (Math.abs(iStar.position.x - jStar.position.x) < this.config.distance && 
                    Math.abs(iStar.position.y - jStar.position.y) < this.config.distance) {

                    //and if the star is close enough to the mouse based on the config radius    
                    if (Math.abs(iStar.position.x - this.config.position.x) < this.config.radius &&
                        Math.abs(iStar.position.y - this.config.position.y) < this.config.radius) {
                        
                        //gets alpha for the the current star
                        let alpha = this.config.stars[j].starProps.alpha;

                        //updates the stroke and fill style with the current star's alpha
                        this.$context.strokeStyle = "rgba(238, 238, 238, " + alpha + ")";
                        this.$context.fillStyle = "rgba(238, 238, 238, " + alpha + ")";

                        //draws line
                        this.$context.beginPath();
                        this.$context.moveTo(iStar.position.x, iStar.position.y);
                        this.$context.lineTo(jStar.position.x, jStar.position.y);
                        this.$context.stroke();
                        this.$context.closePath();
                    }
                }
            }
        }
    }
}

let midnightsky;
window.addEventListener('load', () => midnightsky = new MidnightSky());
window.addEventListener('resize', () => {
    clearInterval(midnightsky.animation);
    midnightsky = new MidnightSky();
});