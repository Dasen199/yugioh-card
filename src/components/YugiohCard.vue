<template>
  <div class="yugioh-card-container">
    <div class="header">
      <div class="title">
        <span>游戏王卡片编辑器</span>
        <div class="actions">
          <el-button size="small" type="primary" @click="exportImage">导出图片</el-button>
          <el-button size="small" type="success" @click="savePreset">保存预设</el-button>
          <el-button size="small" @click="loadPreset">加载预设</el-button>
          <Icon
            class="github-icon"
            icon="ri:github-fill"
            width="20"
            height="20"
            @click="toGithub"
          />
        </div>
      </div>
    </div>

    <div class="content">
      <div class="preview-container">
        <div class="card-preview" ref="previewContainer">
          <div ref="card" class="card" :style="{ transform: `scale(${previewScale})` }" />
          <div class="scale-control">
            <el-slider
              v-model="previewScale"
              :min="0.3"
              :max="0.8"
              :step="0.05"
              :format-tooltip="value => `${(value * 100).toFixed(0)}%`"
            />
          </div>
          <div class="card-info" v-if="form.card === 'yugioh' && formData.name">
            {{ formData.package ? `【${formData.package}】` : '' }} {{formData.name}}
          </div>
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
                  <el-col :span="8">
                    <el-form-item label="语言">
                      <el-select v-model="formData.language" placeholder="选择语言">
                        <el-option label="简体中文" value="sc" />
                        <el-option label="繁体中文" value="tc" />
                        <el-option label="日文" value="jp" />
                        <el-option label="韩文" value="kr" />
                        <el-option label="英文" value="en" />
                        <el-option label="星光界文" value="astral" />
                      </el-select>
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
                        <el-option label="灵摆" value="pendulum" />
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
                        <el-input-number v-model="formData.atk" :min="-2" :max="9999" controls-position="right"></el-input-number>
                        <span class="input-hint">?:-1, ∞:-2</span>
                      </el-form-item>
                    </el-col>
                    
                    <el-col :span="12">
                      <el-form-item label="防御力">
                        <el-input-number v-model="formData.def" :min="-2" :max="9999" controls-position="right"></el-input-number>
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
          
          <!-- 卡片图片 -->
          <div v-show="activeTabIndex === 1 && form.card === 'yugioh'">
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
          
          <!-- 效果描述 -->
          <div v-show="activeTabIndex === 2 && form.card === 'yugioh'">
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
  import { Icon } from '@iconify/vue';
  import { Plus, ArrowLeft, ArrowRight } from '@element-plus/icons-vue';
  import { onBeforeUnmount, onMounted, reactive, ref, shallowRef, watch, computed, nextTick } from 'vue';
  import { YugiohBackCard, YugiohCard } from 'yugioh-card';
  import JsonEditorVue from 'json-editor-vue';
  import yugiohBackDemo from '@/assets/demo/yugioh-back-demo';
  import yugiohDemo from '@/assets/demo/yugioh-demo';

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
  
  const formData = reactive({...yugiohDemo});
  const imageUrl = ref('');
  const previewScale = ref(0.45); // 默认预览缩放比例改为45%
  
  // 选项卡设置
  const tabs = ['基本设置', '卡片图片', '效果描述', '其他设置', '高级设置'];
  const activeTabIndex = ref(0);
  
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
    // 不再需要动态调整容器大小，因为我们使用flex布局居中显示
    console.log('Card ready, scale:', previewScale.value);
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
  
  function savePreset() {
    try {
      const presetName = prompt('请输入预设名称', '我的卡片');
      if (presetName) {
        const presets = JSON.parse(localStorage.getItem('yugioh-card-presets') || '{}');
        presets[presetName] = JSON.parse(JSON.stringify(formData));
        localStorage.setItem('yugioh-card-presets', JSON.stringify(presets));
        alert('预设保存成功');
      }
    } catch (e) {
      alert('保存失败: ' + e.message);
    }
  }
  
  function loadPreset() {
    try {
      const presets = JSON.parse(localStorage.getItem('yugioh-card-presets') || '{}');
      const presetNames = Object.keys(presets);
      if (presetNames.length === 0) {
        alert('没有保存的预设');
        return;
      }
      
      const presetName = prompt('请选择预设:\n' + presetNames.join('\n'), presetNames[0]);
      if (presetName && presets[presetName]) {
        Object.assign(formData, presets[presetName]);
        updateCard();
        alert('预设加载成功');
      }
    } catch (e) {
      alert('加载失败: ' + e.message);
    }
  }
  
  function updateCard() {
    form.data = JSON.parse(JSON.stringify(formData));
    cardLeaf.value.setData(form.data);
    jsonData.value = form.data;
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

  function toGithub() {
    open('https://github.com/kooriookami/yugioh-card');
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
          
          .github-icon {
            cursor: pointer;
          }
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
        
        .card-preview {
          padding: 10px;
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          height: 100%;
          
          .card {
            transition: transform 0.3s;
            transform-origin: center;
            box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
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
      }
      
      .editor {
        min-height: 200px;
        flex: 1;
        overflow: auto;
        padding: 15px;
        background-color: #ffffff;
        border-radius: 4px;
        margin: 0;
        box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
        
        .tab-navigation {
          display: flex;
          align-items: center;
          margin: 0;
          padding: 0;
          border-bottom: 1px solid #ebeef5;
          
          .tabs {
            display: flex;
            align-items: center;
            width: 100%;
            
            .tab {
              cursor: pointer;
              padding: 10px 15px;
              border-bottom: 2px solid transparent;
              white-space: nowrap;
              font-size: 14px;
              flex: 1;
              text-align: center;
              
              &:hover {
                color: #409EFF;
              }
              
              &.active {
                color: #409EFF;
                border-bottom-color: #409EFF;
              }
            }
          }
        }
        
        .tab-content {
          padding: 5px 0;
          
          :deep(.el-form-item) {
            margin-bottom: 14px;
          }
          
          :deep(.el-form-item__label) {
            font-weight: normal;
            color: #606266;
          }
        }
        
        .input-hint {
          margin-left: 5px;
          color: #909399;
          font-size: 12px;
        }
        
        .image-uploader {
          border: 1px dashed #d9d9d9;
          border-radius: 6px;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          transition: border-color 0.3s;
          width: 100%;
          height: 180px;
          display: flex;
          justify-content: center;
          align-items: center;
          
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
          width: auto;
          height: 100%;
          max-width: 100%;
          object-fit: contain;
        }
        
        .upload-hint {
          text-align: center;
          margin-top: 8px;
          color: #606266;
          font-size: 14px;
        }
      }
    }
  }
</style>

