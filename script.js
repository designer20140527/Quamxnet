// Updated animation for hero elements with new structure
document.addEventListener('DOMContentLoaded', function() {
    // Set initial states for animation
    const heroElements = document.querySelectorAll('.hero-content-block h1, .hero-content-block p, .hero-content-block .button-group');
    
    heroElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });
    
    // Trigger animations with delay
    heroElements.forEach((element, index) => {
        setTimeout(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, 300 * index);
    });
});

// Further improved accordion functionality
document.addEventListener('DOMContentLoaded', function() {
    const accordionItems = document.querySelectorAll('.accordion-item');
    
    accordionItems.forEach(item => {
        const header = item.querySelector('.accordion-header');
        
        header.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // First close any other open accordion
            const currentlyActive = document.querySelector('.accordion-item.active');
            if(currentlyActive && currentlyActive !== item) {
                // Add a class for special handling of closing animation
                currentlyActive.classList.add('closing');
                
                // Remove active after a short delay
                setTimeout(() => {
                    currentlyActive.classList.remove('active');
                    currentlyActive.classList.remove('closing');
                }, 50);
            }
            
            // Toggle this accordion with appropriate timing
            if (isActive) {
                item.classList.add('closing');
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        item.classList.remove('active');
                        // Remove the closing class after animation completes
                        setTimeout(() => {
                            item.classList.remove('closing');
                        }, 200);
                    });
                });
            } else {
                item.classList.add('active');
            }
        });
    });
});

// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    let isScrolling = false;

    // 处理所有带有锚点的链接（包括导航栏和页脚的链接）
    function handleAnchorClick(e) {
        const targetId = this.getAttribute('href').substring(1);
        const targetSection = document.getElementById(targetId);
        
        if (targetSection) {
            e.preventDefault();
            isScrolling = true;
            
            // 移除所有 active 类
            navLinks.forEach(link => link.classList.remove('active'));
            
            // 找到对应的导航链接并添加 active 类
            const correspondingNavLink = document.querySelector(`.nav-link[href="#${targetId}"]`);
            if (correspondingNavLink) {
                correspondingNavLink.classList.add('active');
            }

            targetSection.scrollIntoView({ behavior: 'smooth' });
            
            setTimeout(() => {
                isScrolling = false;
            }, 1000);
        }
    }

    function updateActiveLink() {
        if (isScrolling) return;

        let current = '';
        const scrollPosition = window.scrollY;
        
        // 当滚动位置在顶部时，激活 Home
        if (scrollPosition < 100) {
            current = 'home';
        } else {
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                
                if (scrollPosition >= sectionTop - 100 && 
                    scrollPosition < sectionTop + sectionHeight - 100) {
                    current = section.getAttribute('id');
                }
            });
        }

        // 更新导航链接的激活状态
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').substring(1) === current) {
                link.classList.add('active');
            }
        });
    }

    // 为所有带有锚点的链接添加点击事件处理
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', handleAnchorClick);
    });

    updateActiveLink();
    window.addEventListener('scroll', updateActiveLink);
});

// JavaScript-controlled grid animation
document.addEventListener('DOMContentLoaded', function() {
    const heroSection = document.querySelector('.hero');
    const grid = document.querySelector('.interactive-grid');
    
    if (heroSection && grid) {
        const cellSize = 40;
        const heroWidth = heroSection.offsetWidth;
        const heroHeight = heroSection.offsetHeight;
        const columns = Math.ceil(heroWidth / cellSize);
        const rows = Math.ceil(heroHeight / cellSize);
        
        // Calculate center point of the grid
        const centerX = Math.floor(columns / 2) * cellSize;
        const centerY = Math.floor(rows / 2) * cellSize;
        
        const cells = [];
        
        // Create grid cells
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < columns; col++) {
                const cell = document.createElement('div');
                cell.className = 'grid-cell';
                
                // Position the cell
                const left = col * cellSize;
                const top = row * cellSize;
                cell.style.left = `${left}px`;
                cell.style.top = `${top}px`;
                
                // Calculate distance from center for animation
                const distanceFromCenter = Math.sqrt(
                    Math.pow(left - centerX, 2) + 
                    Math.pow(top - centerY, 2)
                );
                
                // Store cell data for animation
                cells.push({
                    element: cell,
                    left,
                    top,
                    distance: distanceFromCenter,
                    animationOffset: distanceFromCenter * 0.003,
                    intensity: 0
                });
                
                grid.appendChild(cell);
            }
        }
        
        // Animation variables
        let animationFrame;
        const animationDuration = 4000; // 4 seconds
        const startTime = performance.now();
        
        // JavaScript animation function
        function animateGrid(timestamp) {
            const elapsed = (timestamp - startTime) % animationDuration;
            const progress = elapsed / animationDuration;
            
            // Maximum distance for normalization
            const maxDistance = Math.sqrt(Math.pow(heroWidth/2, 2) + Math.pow(heroHeight/2, 2));
            
            // Update each cell based on its distance from center
            cells.forEach(cell => {
                // Create a subtle wave effect
                const normalizedDistance = cell.distance / maxDistance;
                const wavePosition = progress - normalizedDistance * 0.6;
                const adjustedPosition = wavePosition % 1;
                
                // Use a gentle wave function for subtle ripples
                let intensity = 0;
                if (adjustedPosition > 0 && adjustedPosition < 0.4) {
                    // Create a smooth curve for the color transition
                    intensity = Math.sin((adjustedPosition / 0.4) * Math.PI) * 0.5;
                }
                
                // Only apply background color changes, keep border constant
                const opacity = Math.max(0.01, intensity * 0.1);
                cell.element.style.backgroundColor = `rgba(155, 89, 182, ${opacity * 0.8})`;
                
                // Keep border constant for all cells
                cell.element.style.borderColor = 'rgba(155, 89, 182, 0.03)';
                
                // Remove all box-shadow effects
                cell.element.style.boxShadow = 'none';
                
                cell.intensity = intensity;
            });
            
            animationFrame = requestAnimationFrame(animateGrid);
        }
        
        // Start animation
        animationFrame = requestAnimationFrame(animateGrid);
        
        // Optimization for scroll events
        window.addEventListener('scroll', function() {
            const scrollTop = window.pageYOffset;
            const viewportHeight = window.innerHeight;
            
            cells.forEach(cell => {
                if (cell.top >= scrollTop - cellSize && cell.top <= scrollTop + viewportHeight) {
                    cell.element.style.display = 'block';
                } else {
                    cell.element.style.display = 'none';
                }
            });
        });
        
        // Clean up animation when leaving the page
        window.addEventListener('beforeunload', function() {
            cancelAnimationFrame(animationFrame);
        });
    }
});

// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    // Create menu overlay
    const overlay = document.createElement('div');
    overlay.className = 'menu-overlay';
    document.body.appendChild(overlay);
    
    // Toggle menu
    menuToggle.addEventListener('click', function() {
        menuToggle.classList.toggle('active');
        navLinks.classList.toggle('active');
        overlay.classList.toggle('active');
        
        // Prevent body scrolling when menu is open
        if (navLinks.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    });
    
    // Close menu when clicking overlay
    overlay.addEventListener('click', function() {
        menuToggle.classList.remove('active');
        navLinks.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    });
    
    // Close menu when clicking nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function() {
            menuToggle.classList.remove('active');
            navLinks.classList.remove('active');
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
});

// 添加 Intersection Observer 来监测元素是否进入视口
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
        }
    });
}, { threshold: 0.1 }); // 当元素有10%进入视口时触发

// 监测所有的 icon-box 元素
document.querySelectorAll('.icon-box').forEach((box) => {
    observer.observe(box);
});

// 在文档加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
  // 获取元素
  const heroContentBlock = document.querySelector('.hero-content-block');
  
  // 强制设置样式
  if (heroContentBlock) {
    heroContentBlock.style.maxWidth = '900px';
    heroContentBlock.style.width = 'auto';
    
    // 移除所有可能影响宽度的样式
    heroContentBlock.style.minWidth = '';
    heroContentBlock.style.boxSizing = 'border-box';
  }
});

// 修改 grid 动画相关的代码
function createGrid() {
    const hero = document.querySelector('.hero');
    const grid = document.querySelector('.interactive-grid');
    
    // 使用固定的网格尺寸，避免小数点计算
    const cellSize = 40;
    const cells = [];
    
    // 计算需要的网格数量，多加一行一列避免边缘空白
    const columns = Math.ceil(hero.offsetWidth / cellSize) + 1;
    const rows = Math.ceil(hero.offsetHeight / cellSize) + 1;
    
    // 清除现有的网格
    grid.innerHTML = '';
    
    // 创建网格单元格
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < columns; j++) {
            const cell = document.createElement('div');
            cell.className = 'grid-cell';
            
            // 使用固定位置，避免浮点数计算
            cell.style.left = `${j * cellSize}px`;
            cell.style.top = `${i * cellSize}px`;
            
            grid.appendChild(cell);
            
            // 计算到中心的距离
            const centerX = hero.offsetWidth / 2;
            const centerY = hero.offsetHeight / 2;
            const cellCenterX = j * cellSize + cellSize / 2;
            const cellCenterY = i * cellSize + cellSize / 2;
            const distance = Math.sqrt(
                Math.pow(centerX - cellCenterX, 2) + 
                Math.pow(centerY - cellCenterY, 2)
            );
            
            cells.push({
                element: cell,
                distance: distance
            });
        }
    }
    
    return cells;
}

// 在窗口调整大小时重新创建网格
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        cells = createGrid();
    }, 100);
}); 