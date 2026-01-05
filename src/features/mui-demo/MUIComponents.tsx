import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  TextField,
  Paper,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  LinearProgress,
  Alert,
  AlertTitle,
  Stack,
  IconButton,
  Fab,
} from '@mui/material';
import {
  Add,
  Delete,
  Edit,
  Favorite,
  Share,
  MoreVert,
  Person,
  Email,
  Phone,
  TrendingUp,
  TrendingDown,
} from '@mui/icons-material';

export default function MUIComponents() {
  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h3" gutterBottom fontWeight="bold" color="primary">
        Material-UI 组件展示
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        这是一个展示 Material-UI 组件的示例页面
      </Typography>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        {/* 统计卡片 */}
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={3}>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography color="text.secondary" variant="body2" gutterBottom>
                    总收入
                  </Typography>
                  <Typography variant="h4" fontWeight="bold">
                    ¥128,560
                  </Typography>
                  <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mt: 1 }}>
                    <TrendingUp fontSize="small" color="success" />
                    <Typography variant="body2" color="success.main">
                      +12.5%
                    </Typography>
                  </Stack>
                </Box>
                <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56 }}>
                  <TrendingUp />
                </Avatar>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={3}>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography color="text.secondary" variant="body2" gutterBottom>
                    新用户
                  </Typography>
                  <Typography variant="h4" fontWeight="bold">
                    1,234
                  </Typography>
                  <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mt: 1 }}>
                    <TrendingUp fontSize="small" color="success" />
                    <Typography variant="body2" color="success.main">
                      +8.2%
                    </Typography>
                  </Stack>
                </Box>
                <Avatar sx={{ bgcolor: 'success.main', width: 56, height: 56 }}>
                  <Person />
                </Avatar>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={3}>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography color="text.secondary" variant="body2" gutterBottom>
                    订单数
                  </Typography>
                  <Typography variant="h4" fontWeight="bold">
                    856
                  </Typography>
                  <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mt: 1 }}>
                    <TrendingDown fontSize="small" color="error" />
                    <Typography variant="body2" color="error.main">
                      -3.1%
                    </Typography>
                  </Stack>
                </Box>
                <Avatar sx={{ bgcolor: 'warning.main', width: 56, height: 56 }}>
                  <Email />
                </Avatar>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={3}>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography color="text.secondary" variant="body2" gutterBottom>
                    完成率
                  </Typography>
                  <Typography variant="h4" fontWeight="bold">
                    94.5%
                  </Typography>
                  <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mt: 1 }}>
                    <TrendingUp fontSize="small" color="success" />
                    <Typography variant="body2" color="success.main">
                      +2.4%
                    </Typography>
                  </Stack>
                </Box>
                <Avatar sx={{ bgcolor: 'info.main', width: 56, height: 56 }}>
                  <Phone />
                </Avatar>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Alerts */}
        <Grid item xs={12} md={6}>
          <Stack spacing={2}>
            <Alert severity="success">
              <AlertTitle>成功</AlertTitle>
              这是一条成功提示信息！
            </Alert>
            <Alert severity="info">
              <AlertTitle>提示</AlertTitle>
              这是一条普通提示信息！
            </Alert>
            <Alert severity="warning">
              <AlertTitle>警告</AlertTitle>
              这是一条警告信息！
            </Alert>
            <Alert severity="error">
              <AlertTitle>错误</AlertTitle>
              这是一条错误信息！
            </Alert>
          </Stack>
        </Grid>

        {/* 进度条 */}
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              项目进度
            </Typography>
            <Stack spacing={2} sx={{ mt: 2 }}>
              <Box>
                <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                  <Typography variant="body2">网站开发</Typography>
                  <Typography variant="body2" color="text.secondary">
                    75%
                  </Typography>
                </Stack>
                <LinearProgress variant="determinate" value={75} />
              </Box>
              <Box>
                <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                  <Typography variant="body2">移动应用</Typography>
                  <Typography variant="body2" color="text.secondary">
                    45%
                  </Typography>
                </Stack>
                <LinearProgress variant="determinate" value={45} color="success" />
              </Box>
              <Box>
                <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                  <Typography variant="body2">UI 设计</Typography>
                  <Typography variant="body2" color="text.secondary">
                    90%
                  </Typography>
                </Stack>
                <LinearProgress variant="determinate" value={90} color="warning" />
              </Box>
            </Stack>
          </Paper>
        </Grid>

        {/* 表单示例 */}
        <Grid item xs={12} md={6}>
          <Card elevation={2}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                联系表单
              </Typography>
              <Stack spacing={2} sx={{ mt: 2 }}>
                <TextField label="姓名" variant="outlined" fullWidth />
                <TextField label="邮箱" type="email" variant="outlined" fullWidth />
                <TextField label="电话" variant="outlined" fullWidth />
                <TextField
                  label="留言"
                  multiline
                  rows={4}
                  variant="outlined"
                  fullWidth
                />
              </Stack>
            </CardContent>
            <CardActions sx={{ px: 2, pb: 2 }}>
              <Button variant="contained" size="large" fullWidth>
                提交
              </Button>
            </CardActions>
          </Card>
        </Grid>

        {/* 用户列表 */}
        <Grid item xs={12} md={6}>
          <Card elevation={2}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                团队成员
              </Typography>
              <List>
                <ListItem
                  secondaryAction={
                    <IconButton edge="end">
                      <MoreVert />
                    </IconButton>
                  }
                >
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: 'primary.main' }}>张</Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary="张三"
                    secondary="产品经理 · 在线"
                  />
                </ListItem>
                <Divider variant="inset" component="li" />
                <ListItem
                  secondaryAction={
                    <IconButton edge="end">
                      <MoreVert />
                    </IconButton>
                  }
                >
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: 'success.main' }}>李</Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary="李四"
                    secondary="UI 设计师 · 1小时前"
                  />
                </ListItem>
                <Divider variant="inset" component="li" />
                <ListItem
                  secondaryAction={
                    <IconButton edge="end">
                      <MoreVert />
                    </IconButton>
                  }
                >
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: 'warning.main' }}>王</Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary="王五"
                    secondary="前端开发 · 离线"
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* 按钮示例 */}
        <Grid item xs={12}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              按钮组件
            </Typography>
            <Stack direction="row" spacing={2} flexWrap="wrap" sx={{ mt: 2, gap: 2 }}>
              <Button variant="contained">主要按钮</Button>
              <Button variant="contained" color="secondary">
                次要按钮
              </Button>
              <Button variant="outlined">边框按钮</Button>
              <Button variant="text">文本按钮</Button>
              <Button variant="contained" startIcon={<Add />}>
                添加
              </Button>
              <Button variant="contained" color="error" startIcon={<Delete />}>
                删除
              </Button>
              <Button variant="contained" color="success" startIcon={<Edit />}>
                编辑
              </Button>
              <IconButton color="primary">
                <Favorite />
              </IconButton>
              <IconButton color="secondary">
                <Share />
              </IconButton>
            </Stack>

            <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
              芯片组件
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mt: 2, gap: 1 }}>
              <Chip label="默认" />
              <Chip label="主要" color="primary" />
              <Chip label="次要" color="secondary" />
              <Chip label="成功" color="success" />
              <Chip label="错误" color="error" />
              <Chip label="警告" color="warning" />
              <Chip label="可删除" onDelete={() => {}} />
              <Chip label="可点击" onClick={() => {}} color="primary" />
              <Chip avatar={<Avatar>M</Avatar>} label="头像芯片" />
            </Stack>
          </Paper>
        </Grid>
      </Grid>

      {/* 悬浮按钮 */}
      <Fab
        color="primary"
        aria-label="add"
        sx={{ position: 'fixed', bottom: 24, right: 24 }}
      >
        <Add />
      </Fab>
    </Container>
  );
}
