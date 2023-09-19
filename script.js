class Cube {
    constructor(options) {
        this.cube = document.querySelector(".cube-container");
        this.cubeContainer = document.querySelector(".main-container");
        this.shadow = document.querySelector(".shadow-container");
        this.top = this.cube.querySelector(".top");
        
        // Set default options and override with provided options
        const defaultOptions = {
            isMoving: true,
            hasShadow: true,
            insensitivity: 40,
            dimension: 300
        }
        this.opts = { ...defaultOptions, ...options };  

        // Add cube interactivity
        if (this.opts.isMoving) this.addMove();
        if (!this.opts.hasShadow) this.shadow.style.display = "none";
        this.loadImg();
        this.setDim();
        this.imgDelete();
        this.dragAndDrop();
    }
        // Set cube sides dimension
    setDim() {
        const root = document.documentElement;
        root.style.setProperty("--cube-dim", this.opts.dimension + "px");
    }
        
        // Add cube dragging functionality
    addMove() {
        this.cubeContainer.addEventListener("mousedown", (e) => {
            this.cube.style.cursor = "grabbing";
            let x1 = e.clientX;
            let y1 = e.clientY;
            this.cubeContainer.addEventListener("mousemove", moveCube);

            window.addEventListener("mouseup", () => {
                this.cubeContainer.removeEventListener("mousemove", moveCube);
                this.cube.style.cursor = "grab";
            });

            let cube = this.cube;
            let shadow = this.shadow;
            let top = this.top;
            let insensitivity = this.opts.insensitivity;
            
            function moveCube(e) {
                let x2 = e.clientX;
                let y2 = e.clientY;
                let moveX = (x2 - x1) / insensitivity;
                let moveY = (y1 - y2) / insensitivity;
                this.cursor = "grabbing";

                if (top.getBoundingClientRect().bottom > 379) moveX = (x1 - x2) / 20;
                
                let prevX = parseInt(getComputedStyle(cube).getPropertyValue("--rotationX"));
                let prevY = parseInt(getComputedStyle(cube).getPropertyValue("--rotationY"));

                cube.style.setProperty("--rotationX", (prevX + moveX) + "deg");
                cube.style.setProperty("--rotationY", (prevY + moveY) + "deg");
                shadow.style.setProperty("--rotationY", (-(prevX + moveX)) + "deg");
            }
        });
    }

     // Load user images
    loadImg() {
        const fileInput = document.querySelectorAll(".user-img-input");

        fileInput.forEach(input => {
            let container = input.closest(".cube-side-inner");
            let img = container.querySelector(".user-cube-img");
            let deleteBtn = container.querySelector(".img-delete");
           
            input.addEventListener("click", () => {
                input.value = "";
            });
           
            input.addEventListener("change", () => {
                const file = input.files[0];
                const reader = new FileReader();
                reader.onload = (e) => {

                    img.src = e.target.result;
                    img.style.display = "block";
                    deleteBtn.style.visibility = "visible";

                    container.addEventListener("mouseover", this.imgBtnVisible);
                    container.addEventListener("mouseout", this.imgBtnHidden);
                }
                reader.readAsDataURL(file);
            })
        })
    }

    // Delete user images
    imgDelete() {
        let imgDelBtn = document.querySelectorAll(".img-delete");
        imgDelBtn.forEach((btn) => {
            btn.addEventListener("click", (e) => {
                let container = btn.closest(".cube-side-inner");
                let img = container.querySelector(".user-cube-img");

                img.src = "";
                img.style.display = "none";
                btn.style.visibility = "hidden";

                container.removeEventListener("mouseover", this.imgBtnVisible);
                container.removeEventListener("mouseout", this.imgBtnHidden);
                this.imgBtnVisible(e);
            })
        })
    }

    // Show add-image buttons
    imgBtnVisible(e) {
        let container = e.target.closest(".cube-side-inner");
        let addImg = container.querySelector(".add-img");
        let input = container.querySelector(".user-img-input");
        addImg.style.display = "block";
        input.style.display = "block";
    }

     // Hide add-image buttons
    imgBtnHidden(e) {
        let container = e.target.closest(".cube-side-inner");
        let addImg = container.querySelector(".add-img");
        let input = container.querySelector(".user-img-input");
        addImg.style.display = "none";
        input.style.display = "none";
    }

    // Implement drag and drop functionality
    dragAndDrop() {
        const imgs = document.querySelectorAll(".img-sample");
        let dragged;

        imgs.forEach((img) => {
            img.addEventListener("drag", (e) => {
                dragged = e.target;
                e.target.classList.add("dragging");
                dragged.style.cursor="grabbing"; 
            })
            
            img.addEventListener("dragend", (e) => {
                e.target.classList.remove("dragging");
            })
        })

        const sideBackground = document.querySelectorAll(".cube-side");
        let enterTarget;

        sideBackground.forEach((side) => {
            side.addEventListener("dragover", (e) => {
                e.preventDefault();
            }, false);

            side.addEventListener("dragenter", (e) => {
               if (e.target.classList.contains("dropzone")) {
                    enterTarget = e.target;
                    highlight(true);
              
                }
            });

            side.addEventListener("dragleave", (e) => {
                if (e.target.classList.contains("dropzone") && enterTarget.classList == e.target.classList) {
                    highlight(false);
                } // Check if entered and left elements are the same to prevent loosing highlight inside the cube area
            });

            side.addEventListener("drop", (e) => {
                e.preventDefault();
                if (e.target.classList.contains("dropzone")) {
                    let url = dragged.src;
                    setBackground(url);
                    highlight(false);
                }
            });      
        })

        const highlight = (isOn) => {
            sideBackground.forEach((el) => {
                isOn === true ? el.classList.add("highlight") : el.classList.remove("highlight");
                })
        }
    
        const setBackground = (url) => {
            sideBackground.forEach((side) => {
                side.style.backgroundImage = `url(${url})`;
            })
        }
    }
}

/* Configure options and pass it to your cube: 
- insenitivity: adjust the distance of cube's movement when the mouse button is held down,
- hasShadow: toggle to display shadow below the cube,
- dimension: set the side lenght of the cube in pixels,
- isMoving: choose whether you want the cube to be movable
*/

const myOptions = {
    insensitivity: 30,
    hasShadow: true,
    dimension: 300,
}

const cube1 = new Cube(myOptions);






