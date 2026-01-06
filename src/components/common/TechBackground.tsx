import { useEffect, useRef } from 'react';

interface TechNode {
  x: number;
  y: number;
  vx: number;
  vy: number;
  label: string;
  radius: number;
  color: string;
}

interface TechBackgroundProps {
  className?: string;
}

export function TechBackground({ className = '' }: TechBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 设置 canvas 尺寸
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // 科技标签列表 - AI、DevOps 相关
    const techLabels = [
      { label: 'AI', color: '#8b5cf6' },
      { label: 'DevOps', color: '#d946ef' },
      { label: 'Machine Learning', color: '#a78bfa' },
      { label: 'Cloud Native', color: '#c084fc' },
      { label: 'Kubernetes', color: '#e879f9' },
      { label: 'Docker', color: '#f0abfc' },
      { label: 'CI/CD', color: '#9333ea' },
      { label: 'Monitoring', color: '#7c3aed' },
      { label: 'Microservices', color: '#a855f7' },
      { label: 'Serverless', color: '#c026d3' },
      { label: 'IaC', color: '#d8b4fe' },
      { label: 'Observability', color: '#e9d5ff' },
      { label: 'GitOps', color: '#8b5cf6' },
      { label: 'Auto Scaling', color: '#a78bfa' },
      { label: 'Deep Learning', color: '#c084fc' },
      { label: 'Neural Network', color: '#e879f9' },
      { label: 'Data Pipeline', color: '#f0abfc' },
      { label: 'Analytics', color: '#9333ea' },
    ];

    // 创建技术节点
    const nodes: TechNode[] = techLabels.map((item) => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      label: item.label,
      radius: 8 + Math.random() * 4,
      color: item.color,
    }));

    // 鼠标位置
    let mouseX = -1000;
    let mouseY = -1000;
    let animationFrameId: number;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // 动画循环
    const animate = () => {
      // 清除画布，使用渐变背景
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, '#0f172a');
      gradient.addColorStop(0.5, '#581c87');
      gradient.addColorStop(1, '#0f172a');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 绘制网格
      ctx.strokeStyle = 'rgba(139, 92, 246, 0.05)';
      ctx.lineWidth = 1;
      const gridSize = 60;
      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // 更新和绘制节点
      nodes.forEach((node) => {
        // 鼠标交互 - 轻微吸引
        const dx = mouseX - node.x;
        const dy = mouseY - node.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 200 && distance > 0) {
          const force = (200 - distance) / 10000;
          node.vx += (dx / distance) * force;
          node.vy += (dy / distance) * force;
        }

        // 更新位置
        node.x += node.vx;
        node.y += node.vy;

        // 边界反弹
        if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
        if (node.y < 0 || node.y > canvas.height) node.vy *= -1;

        // 限制速度
        const speed = Math.sqrt(node.vx ** 2 + node.vy ** 2);
        if (speed > 1.5) {
          node.vx = (node.vx / speed) * 1.5;
          node.vy = (node.vy / speed) * 1.5;
        }

        // 绘制节点（圆形）
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = node.color;
        ctx.fill();

        // 添加发光效果
        const glowGradient = ctx.createRadialGradient(
          node.x,
          node.y,
          0,
          node.x,
          node.y,
          node.radius * 4
        );
        glowGradient.addColorStop(0, `${node.color}60`);
        glowGradient.addColorStop(1, `${node.color}00`);
        ctx.fillStyle = glowGradient;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius * 4, 0, Math.PI * 2);
        ctx.fill();

        // 绘制标签文字
        ctx.font = 'bold 12px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // 添加文字阴影
        ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
        ctx.shadowBlur = 4;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 1;

        ctx.fillText(node.label, node.x, node.y);

        // 重置阴影
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
      });

      // 连接近距离的节点（类似星座连线）
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 250) {
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);

            // 创建渐变连线
            const lineGradient = ctx.createLinearGradient(
              nodes[i].x,
              nodes[i].y,
              nodes[j].x,
              nodes[j].y
            );
            const opacity = (1 - distance / 250) * 0.4;
            lineGradient.addColorStop(0, `${nodes[i].color}${Math.floor(opacity * 255).toString(16).padStart(2, '0')}`);
            lineGradient.addColorStop(1, `${nodes[j].color}${Math.floor(opacity * 255).toString(16).padStart(2, '0')}`);

            ctx.strokeStyle = lineGradient;
            ctx.lineWidth = 1.5;
            ctx.stroke();

            // 在连线中点添加流动的光点（类似能量流动）
            if (distance < 180) {
              const time = Date.now() / 1000;
              const flow = (Math.sin(time * 2 + i + j) + 1) / 2;
              const midX = nodes[i].x + dx * flow;
              const midY = nodes[i].y + dy * flow;

              ctx.beginPath();
              ctx.arc(midX, midY, 2, 0, Math.PI * 2);
              ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
              ctx.fill();

              // 光点的发光效果
              const flowGradient = ctx.createRadialGradient(midX, midY, 0, midX, midY, 8);
              flowGradient.addColorStop(0, 'rgba(255, 255, 255, 0.4)');
              flowGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
              ctx.fillStyle = flowGradient;
              ctx.beginPath();
              ctx.arc(midX, midY, 8, 0, Math.PI * 2);
              ctx.fill();
            }
          }
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className={`fixed inset-0 -z-10 ${className}`} />;
}
