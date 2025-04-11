<template>
  <div class="yugioh-card-container">
    <div class="header">
      <div class="title">
        <span>游戏王AI卡片生成器</span>
        <div class="actions">
          <el-button size="small" type="primary" @click="exportImage">导出图片</el-button>
        </div>
      </div>
    </div>

    <div class="content">
      <div class="preview-container">
        <div class="card-preview" ref="previewContainer">
          <div 
            ref="card" 
            class="card" 
            :style="{ 
              transform: `translate(-50%, -50%) scale(${previewScale})`,
              position: 'absolute',
              top: '50%',
              left: '50%'
            }" 
          />
          <div class="scale-control">
            <el-slider
              v-model="previewScale"
              :min="0.3"
              :max="0.8"
              :step="0.05"
              :format-tooltip="value => `${(value * 100).toFixed(0)}%`"
            />
          </div>
        </div>
        <div class="card-info" v-if="form.card === 'yugioh' && formData.name">
          {{ formData.package ? `【${formData.package}】` : '' }} {{formData.name}}
        </div>
      </div>

      <div class="editor">
        <div class="tab-navigation">
          <div class="tabs">
            <span 
              v-for="(tab, index) in tabs" 
              :key="index"
              :class="['tab', { active: activeTabIndex === index }]"
              @click="activeTabIndex = index"
            >
              {{ tab }}
            </span>
          </div>
        </div>

        <div class="tab-content">
          <!-- 基本设置 -->
          <div v-show="activeTabIndex === 0">
            <div class="settings-section">
              <h3>AI卡片生成</h3>
              <div class="ai-generator-wrapper">
                <AICardGenerator @apply-to-card="applyGeneratedCard" />
              </div>
            </div>
            
            <div class="settings-section">
              <h3>手动设置</h3>
              <el-form :model="formData" label-width="80px" size="small">
                <el-form-item label="卡片类型">
            <el-select
              v-model="form.card"
                    placeholder="请选择卡片类型"
              @change="changeCard"
            >
              <el-option label="游戏王" value="yugioh" />
              <el-option label="游戏王卡背" value="yugioh-back" />
                  </el-select>
                </el-form-item>
                
                <template v-if="form.card === 'yugioh'">
                  <el-row :gutter="10">
                    <el-col :span="16">
                      <el-form-item label="卡名">
                        <el-input v-model="formData.name" placeholder="请输入卡名"></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  
                  <el-row :gutter="10">
                    <el-col :span="12">
                      <el-form-item label="卡片种类">
                        <el-select v-model="formData.type" placeholder="请选择卡片种类">
                          <el-option label="怪兽" value="monster" />
                          <el-option label="魔法" value="spell" />
                          <el-option label="陷阱" value="trap" />
                        </el-select>
                      </el-form-item>
                    </el-col>
                    
                    <el-col :span="12" v-if="formData.type === 'monster'">
                      <el-form-item label="怪兽种类">
                        <el-select v-model="formData.cardType" placeholder="请选择怪兽种类">
                          <el-option label="通常" value="normal" />
                          <el-option label="效果" value="effect" />
                          <el-option label="仪式" value="ritual" />
                          <el-option label="融合" value="fusion" />
                          <el-option label="同调" value="synchro" />
                          <el-option label="超量" value="xyz" />
                          <el-option label="连接" value="link" />
                          <el-option label="衍生物" value="token" />
                        </el-select>
                      </el-form-item>
                    </el-col>
                    
                    <el-col :span="12" v-if="formData.type === 'spell' || formData.type === 'trap'">
                      <el-form-item label="魔法/陷阱图标">
                        <el-select v-model="formData.icon" placeholder="请选择图标">
                          <el-option label="无" value="" />
                          <el-option label="装备" value="equip" />
                          <el-option label="场地" value="field" />
                          <el-option label="速攻" value="quick-play" />
                          <el-option label="仪式" value="ritual" />
                          <el-option label="永续" value="continuous" />
                          <el-option label="反击" value="counter" />
                        </el-select>
                      </el-form-item>
                    </el-col>
                  </el-row>

                  <template v-if="formData.type === 'monster'">
                    <el-row :gutter="10">
                      <el-col :span="12">
                        <el-form-item label="属性">
                          <el-select v-model="formData.attribute" placeholder="请选择属性">
                            <el-option label="暗" value="dark" />
                            <el-option label="光" value="light" />
                            <el-option label="地" value="earth" />
                            <el-option label="水" value="water" />
                            <el-option label="炎" value="fire" />
                            <el-option label="风" value="wind" />
                            <el-option label="神" value="divine" />
                          </el-select>
                        </el-form-item>
                      </el-col>
                      
                      <el-col :span="12">
                        <el-form-item label="星级/阶级">
                          <el-input-number v-model="formData.level" :min="0" :max="12" controls-position="right"></el-input-number>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    
                    <el-form-item label="怪兽类型">
                      <el-input v-model="formData.monsterType" placeholder="如：龙族/通常"></el-input>
                    </el-form-item>
                    
                    <el-row :gutter="10">
                      <el-col :span="12">
                        <el-form-item label="攻击力">
                          <el-input-number 
                            v-model="formData.atk" 
                            :min="-2" 
                            :max="9999" 
                            controls-position="right"
                            style="width: 100px;"
                          ></el-input-number>
                          <span class="input-hint">?:-1, ∞:-2</span>
                        </el-form-item>
                      </el-col>
                      
                      <el-col :span="12">
                        <el-form-item label="防御力">
                          <el-input-number 
                            v-model="formData.def" 
                            :min="-2" 
                            :max="9999" 
                            controls-position="right"
                            style="width: 100px;"
                          ></el-input-number>
                          <span class="input-hint">?:-1, ∞:-2</span>
                        </el-form-item>
                      </el-col>
                    </el-row>
                  </template>
                </template>
                
                <template v-if="form.card === 'yugioh-back'">
                  <el-row :gutter="10">
                    <el-col :span="12">
                      <el-form-item label="卡背类型">
                        <el-select v-model="formData.type" placeholder="请选择卡背类型">
                          <el-option label="通常" value="normal" />
                          <el-option label="巨神兵" value="tormentor" />
                          <el-option label="天空龙" value="sky-dragon" />
                          <el-option label="翼神龙" value="winged-dragon" />
                        </el-select>
                      </el-form-item>
                    </el-col>
                    
                    <el-col :span="12">
                      <el-form-item label="标志">
                        <el-select v-model="formData.logo" placeholder="请选择标志">
                          <el-option label="OCG" value="ocg" />
                          <el-option label="TCG" value="tcg" />
                          <el-option label="RD" value="rd" />
                        </el-select>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  
                  <el-row :gutter="10">
                    <el-col :span="12">
                      <el-form-item label="K标">
                        <el-switch v-model="formData.konami"></el-switch>
                      </el-form-item>
                    </el-col>
                    
                    <el-col :span="12">
                      <el-form-item label="R标">
                        <el-switch v-model="formData.register"></el-switch>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </template>
              </el-form>
            </div>
          </div>
          
          <!-- 卡片图片 -->
          <div v-show="activeTabIndex === 1">
            <div class="settings-section">
              <h3>图片上传</h3>
              <el-upload
                class="image-uploader"
                action="#"
                :show-file-list="false"
                :on-change="handleImageChange"
                :auto-upload="false"
              >
                <img v-if="imageUrl" :src="imageUrl" class="uploaded-image">
                <el-icon v-else class="image-uploader-icon"><plus /></el-icon>
              </el-upload>
              <div class="upload-hint">点击上传卡片图片</div>
            </div>

            <div class="settings-section">
              <h3>AI提示词编辑</h3>
              <el-form label-width="90px" size="small">
                <el-form-item label="图片描述">
                  <el-input
                    v-model="imagePrompt.description"
                    type="textarea"
                    :rows="4"
                    placeholder="描述卡片形象，如角色外观、姿势、背景等"
                  ></el-input>
                </el-form-item>
                <el-form-item label="图片风格">
                  <el-input
                    v-model="imagePrompt.style"
                    placeholder="图片风格，如明亮色彩、动态漫画风格等"
                  ></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="generateCustomImage" :loading="imageGenerating">重新生成图片</el-button>
                </el-form-item>
              </el-form>
            </div>
          </div>
          
          <!-- 效果描述 -->
          <div v-show="activeTabIndex === 2">
            <el-form :model="formData" label-width="90px" size="small">
              <el-form-item label="效果描述">
                <el-input
                  v-model="formData.description"
                  type="textarea"
                  :rows="5"
                  placeholder="请输入卡片效果描述"
                ></el-input>
              </el-form-item>
              
              <el-row :gutter="10">
                <el-col :span="12">
                  <el-form-item label="首行压缩">
                    <el-switch v-model="formData.firstLineCompress"></el-switch>
                  </el-form-item>
                </el-col>
                
                <el-col :span="12">
                  <el-form-item label="描述居中">
                    <el-switch v-model="formData.descriptionAlign"></el-switch>
                  </el-form-item>
                </el-col>
              </el-row>
              
              <el-row :gutter="10">
                <el-col :span="12">
                  <el-form-item label="描述缩放">
                    <el-slider v-model="formData.descriptionZoom" :min="0.5" :max="1.5" :step="0.1"></el-slider>
                  </el-form-item>
                </el-col>
                
                <el-col :span="12">
                  <el-form-item label="描述字重">
                    <el-slider v-model="formData.descriptionWeight" :min="0" :max="5" :step="1"></el-slider>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </div>
          
          <!-- 其他设置 -->
          <div v-show="activeTabIndex === 3">
            <el-form :model="formData" label-width="90px" size="small">
              <el-row :gutter="10">
                <el-col :span="12">
                  <el-form-item label="卡包">
                    <el-input v-model="formData.package" placeholder="请输入卡包编号"></el-input>
                  </el-form-item>
                </el-col>
                
                <el-col :span="12">
                  <el-form-item label="卡片密码">
                    <el-input v-model="formData.password" placeholder="请输入卡片密码"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              
              <el-row :gutter="10" v-if="form.card === 'yugioh'">
                <el-col :span="12">
                  <el-form-item label="版权">
                    <el-select v-model="formData.copyright" placeholder="请选择版权语言">
                      <el-option label="无" value="" />
                      <el-option label="简体中文" value="sc" />
                      <el-option label="日文" value="jp" />
                      <el-option label="英文" value="en" />
                    </el-select>
                  </el-form-item>
                </el-col>
                
                <el-col :span="12">
                  <el-form-item label="稀有度">
                    <el-select v-model="formData.rare" placeholder="请选择稀有度">
                      <el-option label="无" value="" />
                      <el-option label="DT" value="dt" />
                      <el-option label="UR" value="ur" />
                      <el-option label="GR" value="gr" />
                      <el-option label="HR" value="hr" />
                      <el-option label="SER" value="ser" />
                      <el-option label="GSER" value="gser" />
                      <el-option label="PSER" value="pser" />
            </el-select>
          </el-form-item>
                </el-col>
              </el-row>
              
              <el-row :gutter="10">
                <el-col :span="8" v-if="form.card === 'yugioh'">
                  <el-form-item label="20周年">
                    <el-switch v-model="formData.twentieth"></el-switch>
                  </el-form-item>
                </el-col>
                
                <el-col :span="8">
                  <el-form-item label="圆角">
                    <el-switch v-model="formData.radius"></el-switch>
                  </el-form-item>
                </el-col>
                
                <el-col :span="8">
                  <el-form-item label="卡片缩放">
                    <el-slider v-model="formData.scale" :min="0.5" :max="1.5" :step="0.1"></el-slider>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </div>
          
          <!-- 高级设置 -->
          <div v-show="activeTabIndex === 4">
            <el-form :model="form" label-width="80px" size="small">
              <el-form-item label="JSON数据">
            <json-editor-vue
              v-model="jsonData"
                  style="width: 100%; height: 200px;"
              mode="text"
              v-bind="jsonOption"
            />
          </el-form-item>
        </el-form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { Plus, ArrowLeft, ArrowRight } from '@element-plus/icons-vue';
  import { onBeforeUnmount, onMounted, reactive, ref, shallowRef, watch, computed, nextTick } from 'vue';
  import { YugiohBackCard, YugiohCard } from 'yugioh-card';
  import JsonEditorVue from 'json-editor-vue';
  import yugiohBackDemo from '@/assets/demo/yugioh-back-demo';
  import yugiohDemo from '@/assets/demo/yugioh-demo';
  import AICardGenerator from './AICardGenerator.vue';

  const card = ref(null);
  const cardLeaf = shallowRef(null);
  const previewContainer = ref(null);
  const form = reactive({
    card: 'yugioh',
    data: {},
  });
  const jsonData = ref('');
  const jsonOption = reactive({
    mainMenuBar: false,
    statusBar: false,
  });
  
  const formData = reactive({
    name: '',
    package: '',
    type: 'monster',
    cardType: 'normal',
    attribute: 'dark',
    level: 7,
    monsterType: '龙族',
    atk: 2500,
    def: 2100,
    description: '',
    pendulumDescription: '',
    pendulumScale: 8,
    author: '',
    authorColor: '#fff',
    cardNameColor: '#000',
    cardAuthorColor: '#c09c61',
    cardSubNameColor: '#4b4b4b',
    cardPackageColor: '#000',
    language: 'sc', // 默认简体中文
    icon: '',
    flash: false,
    cardbag: 'tcg',
    password: '',
    rarity: 'normal',
    artOffset: {
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      rotate: 0
    }
  });
  const imageUrl = ref('');
  const previewScale = ref(0.45); // 默认预览缩放比例改为45%
  
  // 设置Tab导航
  const activeTabIndex = ref(0);
  const tabs = [
    '基本',
    '图片',
    '效果',
    '其它',
    '高级'
  ];
  
  function previousTab() {
    if (activeTabIndex.value > 0) {
      activeTabIndex.value--;
    }
  }
  
  function nextTab() {
    if (activeTabIndex.value < tabs.length - 1) {
      activeTabIndex.value++;
    }
  }

  onMounted(() => {
    changeCard();
    
    // 监听预览缩放变化，调整容器
    watch(previewScale, () => {
      nextTick(() => {
        adjustPreviewContainer();
      });
    });
  });
  
  // 修改adjustPreviewContainer函数
  function adjustPreviewContainer() {
    if (!previewContainer.value || !card.value) return;
    
    // 确保卡片始终在视图的中央
    const cardElement = card.value;
    
    // 设置初始滚动位置为容器中间，这样可以上下滚动
    nextTick(() => {
      if (previewContainer.value) {
        const containerHeight = previewContainer.value.clientHeight;
        const cardHeight = cardElement.scrollHeight * previewScale.value;
        
        // 计算卡片的实际高度和容器中心位置的差值
        // 这确保卡片在缩放后依然可以向上和向下滚动
        const scrollPosition = Math.max(0, (cardHeight - containerHeight) / 2);
        
        // 设置滚动位置
        previewContainer.value.scrollTop = scrollPosition;
      }
    });
    
    console.log('Card adjusted, scale:', previewScale.value);
  }

  onBeforeUnmount(() => {
    cardLeaf.value?.leafer.destroy();
  });

  function changeCard() {
    cardLeaf.value?.leafer.destroy();
    let Card;
    switch (form.card) {
      case 'yugioh':
        form.data = yugiohDemo;
        Object.assign(formData, yugiohDemo);
        Card = YugiohCard;
        break;
      case 'yugioh-back':
        form.data = yugiohBackDemo;
        Object.assign(formData, yugiohBackDemo);
        Card = YugiohBackCard;
        break;
      default:
        form.data = yugiohDemo;
        Object.assign(formData, yugiohDemo);
        Card = YugiohCard;
    }
    cardLeaf.value = new Card({
      view: card.value,
      data: form.data,
      resourcePath: process.env.NODE_ENV === 'production' ? 'https://static.ygosgs.com' : 'src/assets/yugioh-card',
    });
    jsonData.value = form.data;
    
    // 如果是预设的图片URL，展示到上传组件
    if (form.data.image && typeof form.data.image === 'string') {
      imageUrl.value = form.data.image;
    }
    
    // 卡片创建后调整容器大小
    nextTick(() => {
      adjustPreviewContainer();
    });
  }

  function exportImage() {
    cardLeaf.value.leafer.export('卡片.png');
  }

  function handleImageChange(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      imageUrl.value = e.target.result;
      formData.image = e.target.result;
      updateCard();
    };
    reader.readAsDataURL(file.raw);
  }
  
  function updateCard() {
    form.data = JSON.parse(JSON.stringify(formData));
    if (cardLeaf.value) {
      cardLeaf.value.setData(form.data);
      jsonData.value = form.data;
    } else {
      console.warn('cardLeaf.value is null, cannot update card');
      // 尝试延迟重新初始化卡片
      nextTick(() => {
        if (!cardLeaf.value) {
          console.log('尝试重新初始化卡片...');
          changeCard();
        }
      });
    }
  }

  // 监听表单数据变化，自动更新卡片
  watch(formData, () => {
    updateCard();
  }, { deep: true });

  // 监听JSON编辑器变化
  watch(() => jsonData.value, () => {
    try {
      const newData = JSON.parse(jsonData.value);
      form.data = newData;
      Object.assign(formData, newData);
      cardLeaf.value.setData(form.data);
    } catch (e) {
      // JSON解析错误，忽略
    }
  });

  // 增加图片提示词相关数据
  const imagePrompt = reactive({
    description: '',
    style: 'Bright colors, illustrated in dynamic comic book style, Yu-Gi-Oh style'
  });
  
  const imageGenerating = ref(false);

  // 生成自定义图片
  async function generateCustomImage() {
    if (!imagePrompt.description.trim()) {
      alert('请输入图片描述');
      return;
    }
    
    imageGenerating.value = true;
    
    try {
      // 检测是否为中文输入
      const hasChinese = /[\u4e00-\u9fa5]/.test(imagePrompt.description);
      let englishDescription = imagePrompt.description.trim();
      
      // 如果有中文，先翻译成英文
      if (hasChinese) {
        try {
          const translatePrompt = `请将下面的中文描述翻译成详细的英文，用于AI绘图生成：
"${imagePrompt.description}"
只返回英文翻译结果，不要有其他说明。`;
          
          const translateResponse = await fetch(`https://text.pollinations.ai/${encodeURIComponent(translatePrompt)}?model=openai&private=true`);
          
          if (translateResponse.ok) {
            const translatedText = await translateResponse.text();
            englishDescription = translatedText.trim();
            console.log("翻译结果:", englishDescription);
          } else {
            console.warn("翻译失败，将使用原始输入");
          }
        } catch (translateError) {
          console.error("翻译过程出错:", translateError);
        }
      }
      
      // 组合提示词 (使用翻译后的英文描述)
      const fullPrompt = englishDescription + ', ' + imagePrompt.style.trim();
      const seed = Math.floor(Math.random() * 9999);
      const imageApiUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(fullPrompt)}?width=1024&height=1024&nologo=true&seed=${seed}`;
      
      // 通过创建Image对象确认图像已加载
      await new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve();
        img.onerror = () => reject(new Error('图片生成失败'));
        img.src = imageApiUrl;
        
        // 超时处理 - 10秒后继续，避免无限等待
        setTimeout(() => resolve(), 10000);
      });
      
      // 设置图片URL
      formData.image = imageApiUrl;
      imageUrl.value = imageApiUrl;
      
      // 更新卡片
      if (cardLeaf.value) {
        updateCard();
      }
      
    } catch (error) {
      console.error('自定义图片生成失败:', error);
      alert('图片生成失败，请重试');
    } finally {
      imageGenerating.value = false;
    }
  }

  function applyGeneratedCard(generatedData) {
    // 设置卡片类型
    if (generatedData.cardType === 'monster') {
      formData.type = 'monster';
      
      // 检查怪兽类型中是否包含"效果"关键字
      if (generatedData.monsterType && generatedData.monsterType.includes('效果')) {
        formData.cardType = 'effect'; // 设置为效果怪兽
      } else {
        formData.cardType = 'normal'; // 默认设置为通常怪兽
      }
    } else if (generatedData.cardType === 'spell') {
      formData.type = 'spell';
    } else if (generatedData.cardType === 'trap') {
      formData.type = 'trap';
    }
    
    if (generatedData.name) {
      formData.name = generatedData.name;
    }
    
    if (generatedData.description) {
      formData.description = generatedData.description;
    }
    
    if (generatedData.imageUrl && form.card === 'yugioh') {
      imageUrl.value = generatedData.imageUrl;
      formData.image = generatedData.imageUrl;
      
      // 提取图片URL中的提示词
      try {
        const urlParams = new URL(generatedData.imageUrl).pathname;
        const promptPart = decodeURIComponent(urlParams.split('/prompt/')[1] || '');
        
        // 分割提示词和样式
        const fixedStyleSuffix = ", Bright colors, illustrated in dynamic comic book style, Yu-Gi-Oh style";
        if (promptPart && promptPart.includes(fixedStyleSuffix)) {
          imagePrompt.description = promptPart.replace(fixedStyleSuffix, '').trim();
          imagePrompt.style = fixedStyleSuffix.substring(2); // 移除开头的逗号和空格
        } else {
          // 如果无法分割，就将整个提示词放入description
          imagePrompt.description = promptPart;
        }
      } catch (e) {
        console.error('解析图片URL中的提示词失败:', e);
      }
    }
    
    // 应用怪兽属性（如果是怪兽卡）
    if (form.card === 'yugioh' && formData.type === 'monster') {
      if (generatedData.monsterType) {
        formData.monsterType = generatedData.monsterType;
      }
      
      if (generatedData.level) {
        formData.level = generatedData.level;
      }
      
      if (generatedData.atk) {
        formData.atk = generatedData.atk;
      }
      
      if (generatedData.def) {
        formData.def = generatedData.def;
      }
      
      // 应用属性
      if (generatedData.attribute) {
        formData.attribute = generatedData.attribute;
      }
    }
    
    // 更新卡片
    updateCard();
  }
</script>

<style lang="scss" scoped>
  .yugioh-card-container {
    height: 100vh;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    background-color: #f5f7fa;
    
    .header {
      padding: 8px 16px;
      background-color: #ffffff;
      border-bottom: 1px solid #dcdfe6;
      box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
      
      .title {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 16px;
        font-weight: bold;

        .actions {
          display: flex;
          align-items: center;
          gap: 10px;
        }
      }
    }

    .content {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      padding: 10px;
      
      .preview-container {
        height: 380px;
        max-height: 380px;
        width: 100%;
      overflow: auto;
        background-color: #ffffff;
        border-radius: 4px;
        box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
        margin-bottom: 10px;
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
        
        .card-preview {
          padding: 10px;
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          height: 100%;
          width: 100%;
          overflow: auto;
          
          .card {
            transition: transform 0.3s;
            transform-origin: center;
            box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
            margin: auto;
          }
          
          .scale-control {
            position: absolute;
            bottom: 35px;
            width: 200px;
            background-color: rgba(255, 255, 255, 0.8);
            padding: 5px 10px;
            border-radius: 15px;
            border: 1px solid #ebeef5;
          }
        }
        
        .card-info {
          position: absolute;
          bottom: 5px;
          left: 0;
          right: 0;
          text-align: center;
          color: #606266;
          font-size: 12px;
          background-color: rgba(255, 255, 255, 0.8);
          padding: 2px 0;
          border-top: 1px solid #ebeef5;
          z-index: 10;
        }
      }
      
      .editor {
        flex: 1;
        display: flex;
        flex-direction: column;
        background-color: #f9fafc;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
        overflow: hidden;
        
        .tab-navigation {
          background-color: #f0f2f5;
          border-bottom: 1px solid #e4e7ed;
          
          .tabs {
            display: flex;
            padding: 0 16px;
            justify-content: center;
            
            .tab {
              padding: 10px 16px;
              cursor: pointer;
              color: #606266;
              font-size: 14px;
              position: relative;
              transition: all 0.2s;
              border-bottom: 2px solid transparent;
              
              &.active {
                color: #409eff;
                border-bottom-color: #409eff;
              }
              
              &:hover:not(.active) {
                color: #8cc5ff;
              }
            }
          }
        }
        
        .tab-content {
          flex: 1;
          padding: 15px;
          overflow-y: auto;
        }
      }
    }
  }

  .settings-section {
    background-color: #f9fafc;
    border-radius: 8px;
    margin-bottom: 15px;
    padding: 12px 15px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
    
    h3 {
      font-size: 16px;
      margin: 0 0 12px;
      padding-bottom: 8px;
      border-bottom: 1px solid #e6e8eb;
      color: #414756;
    }
  }

  .ai-generator-wrapper {
    padding: 5px;
    margin-bottom: 15px;
  }

  /* 移除特定数据属性 */
  [class*='data-v-'] {
    all: unset;
  }

  /* 美化表单按钮 */
  .el-form-item__content .el-button {
    margin-right: 10px;
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .el-form-item__content .el-button:hover {
    transform: translateY(-1px);
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.15);
  }

  /* 减小生成图片的尺寸 */
  .generated-image {
    max-width: 90%;
    max-height: 300px;
    object-fit: contain;
    border-radius: 4px;
    border: 1px solid #EBEEF5;
  }

  /* 允许卡片滚动 */
  .card-preview {
    overflow-y: auto;
    max-height: 100%;
  }

  /* 确保卡片预览容器可滚动 */
  .preview-container {
    height: 100%;
    overflow: hidden;
    position: relative;
  }

  /* 卡片图片上传区域样式 */
  .image-uploader {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: border-color 0.3s;
    width: 100%;
    max-width: 400px;
    height: 200px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0 auto;
    
    &:hover {
      border-color: #409EFF;
    }
  }
  
  .image-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 28px;
    height: 28px;
  }
  
  .uploaded-image {
    max-width: 100%;
    max-height: 100%;
    width: auto;
    height: auto;
    object-fit: contain;
  }
  
  .upload-hint {
    text-align: center;
    margin-top: 8px;
    color: #606266;
    font-size: 14px;
  }

  /* 修复攻击力和防御力输入框样式 */
  :deep(.el-input-number) {
    width: 120px !important;
    
    .el-input__wrapper {
      padding: 0 5px !important;
    }
    
    .el-input__inner {
      width: 100% !important;
      padding-right: 30px !important;
    }
    
    .el-input-number__decrease,
    .el-input-number__increase {
      width: 24px !important;
    }
  }

  .input-hint {
    margin-left: 5px;
    font-size: 12px;
    color: #909399;
  }
</style>

