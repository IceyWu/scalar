<script setup lang="ts">
import { useResizeObserver } from '@vueuse/core'
import { type TargetId } from 'httpsnippet-lite'
import { computed, ref } from 'vue'

import { useSnippetTargets } from '../../../hooks'
import { type SelectedClient, useTemplateStore } from '../../../stores/template'
import { Icon } from '../../Icon'

// Use the template store to keep it accessible globally
const { state, setItem, getClientTitle, getTargetTitle } = useTemplateStore()

const { availableTargets } = useSnippetTargets()

const isSmall = ref(false)
const containerRef = ref<HTMLElement>()

useResizeObserver(
  containerRef,
  (entries) => (isSmall.value = entries[0].contentRect.width < 500),
)

// Show popular clients with an icon, not just in a select.
const featuredClients = computed<SelectedClient[]>(() =>
  isSmall.value
    ? // Mobile
      [
        {
          targetKey: 'shell',
          clientKey: 'curl',
        },
        {
          targetKey: 'ruby',
          clientKey: 'native',
        },
        {
          targetKey: 'node',
          clientKey: 'undici',
        },
        {
          targetKey: 'python',
          clientKey: 'python3',
        },
      ]
    : // Desktop
      [
        {
          targetKey: 'shell',
          clientKey: 'curl',
        },
        {
          targetKey: 'ruby',
          clientKey: 'native',
        },
        {
          targetKey: 'node',
          clientKey: 'undici',
        },
        {
          targetKey: 'php',
          clientKey: 'guzzle',
        },
        {
          targetKey: 'python',
          clientKey: 'python3',
        },
        {
          targetKey: 'c',
          clientKey: 'libcurl',
        },
      ],
)

/**
 * Icons have longer names to appear in icon searches, e.g. "javascript-js" instead of just "javascript". This function
 * maps the language key to the icon name.
 */
const getIconByLanguageKey = (targetKey: TargetId) => {
  const targetKeyMap: Partial<Record<TargetId, string>> = {
    javascript: 'javascript-js',
  }

  const icon = targetKeyMap[targetKey] ?? targetKey

  return `brand/programming-language-${icon}`
}

const isSelectedClient = (language: SelectedClient) => {
  return (
    language.targetKey === state.selectedClient.targetKey &&
    language.clientKey === state.selectedClient.clientKey
  )
}

function checkIfClientIsFeatured(client: SelectedClient) {
  return featuredClients.value.some((item) => {
    return (
      item.targetKey === client.targetKey && item.clientKey === client.clientKey
    )
  })
}
</script>
<template>
  <div
    ref="containerRef"
    class="client-libraries-content">
    <div
      v-for="client in featuredClients"
      :key="client.clientKey"
      class="code-languages rendered-code-sdks"
      :class="{
        'code-languages__active': isSelectedClient(client),
      }"
      @click="() => setItem('selectedClient', client)">
      <div
        class="code-languages-background"
        :class="`code-languages-icon__${client.targetKey}`">
        <Icon
          class="code-languages-icon"
          :src="getIconByLanguageKey(client.targetKey)" />
      </div>
      <span>{{ getTargetTitle(client) }}</span>
    </div>

    <div
      class="code-languages code-languages__select"
      :class="{
        'code-languages__active':
          state.selectedClient &&
          !checkIfClientIsFeatured(state.selectedClient),
      }">
      <select
        class="language-select"
        :value="JSON.stringify(state.selectedClient)"
        @input="
          (event) =>
            setItem(
              'selectedClient',
              JSON.parse((event.target as HTMLSelectElement).value),
            )
        ">
        <optgroup
          v-for="target in availableTargets"
          :key="target.key"
          :label="target.title">
          <option
            v-for="client in target.clients"
            :key="client.key"
            :value="
              JSON.stringify({
                targetKey: target.key,
                clientKey: client.key,
              })
            ">
            {{
              getClientTitle({
                targetKey: target.key,
                clientKey: client.key,
              })
            }}
          </option>
        </optgroup>
      </select>

      <div class="code-languages-background code-languages-icon__more">
        <template
          v-if="
            state.selectedClient &&
            !checkIfClientIsFeatured(state.selectedClient)
          ">
          <div
            class="code-languages-background"
            :class="`code-languages-icon__${state.selectedClient.targetKey}`">
            <Icon
              class="code-languages-icon"
              :src="getIconByLanguageKey(state.selectedClient.targetKey)" />
          </div>
        </template>
        <template v-else>
          <svg
            class="code-languages-icon"
            height="50"
            viewBox="0 0 50 50"
            width="50"
            xmlns="http://www.w3.org/2000/svg">
            <g
              fill="currentColor"
              fill-rule="nonzero">
              <path
                d="M10.71 25.3a3.87 3.87 0 1 0 7.74 0 3.87 3.87 0 0 0-7.74 0M21.13 25.3a3.87 3.87 0 1 0 7.74 0 3.87 3.87 0 0 0-7.74 0M31.55 25.3a3.87 3.87 0 1 0 7.74 0 3.87 3.87 0 0 0-7.74 0" />
            </g>
          </svg>
        </template>
      </div>
      <span>More</span>
    </div>
  </div>
</template>
<style scoped>
.client-libraries-content {
  display: flex;
  justify-content: center;
  gap: 6px;
  padding: 0 12px;
  overflow: hidden;
}
.code-languages {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  max-width: 60px;
  width: 100%;
  padding: 12px 0;
  position: relative;
  cursor: pointer;
  white-space: nowrap;
}
/* remove php and c on mobile */
@media screen and (max-width: 450px) {
  .code-languages:nth-of-type(4),
  .code-languages:nth-of-type(6) {
    display: none;
  }
}
.code-languages-icon {
  max-width: 42px;
  width: 100%;
  max-height: 42px;
  aspect-ratio: 1;
  padding: 9px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  box-sizing: border-box;
  color: var(
    --theme-code-language-color-supersede,
    var(--default-theme-code-language-color-supersede, #fff)
  );
}
.code-languages-background {
  border-radius: 9px;
  position: relative;
  box-shadow: 0 0 0 1px
    var(
      --theme-code-languages-border-color,
      var(--default-theme-code-languages-border-color)
    );
}
.code-languages-background:before {
  content: '';
  width: calc(100% + 2px);
  height: calc(100% + 2px);
  position: absolute;
  top: -1px;
  left: -1px;
  pointer-events: none;
  border-radius: 12px;
  background: var(
    --theme-code-languages-background-supersede,
    var(--default-theme-code-languages-background-supersede)
  );
}
.code-languages-icon__shell {
  background: #000;
}
.code-languages-icon__ruby {
  background: #d91404;
}
.code-languages-icon__php {
  background: #6181b6;
}
.code-languages-icon__python {
  background: #306998;
}
.code-languages-icon__more {
  background: var(--theme-background-3, var(--default-theme-background-3));
}
.code-languages-icon__more svg {
  height: initial;
}
.code-languages-icon__node {
  background: #83cd29;
}
.code-languages-icon__c {
  background: #03599c;
}
.code-languages-icon__csharp {
  background: #68217a;
}
.code-languages-icon__cplusplus {
  background: #9c033a;
}
.code-languages-icon__clojure {
  background: #5881d8;
}
.code-languages-icon__go {
  background: #00acd7;
}
.code-languages-icon__http {
  background: #005b9b;
}
.code-languages-icon__java {
  background: #ea2d2e;
}
.code-languages-icon__javascript {
  background: #f0db4f;
}
.code-languages-icon__kotlin {
  background: #7f6cb1;
}
.code-languages-icon__objc {
  background: #0b5a9d;
}
.code-languages-icon__ocaml {
  background: #f29100;
}
.code-languages-icon__powershell {
  background: #2671be;
}
.code-languages-icon__r {
  background: #cbced0;
}
.code-languages-icon__swift {
  background: #f05138;
}
.code-languages__loading .code-languages-icon:before {
  border: 1px solid rgba(255, 255, 255, 0.44);
  border-top: 1px solid white;
  animation: codeloader 0.45s linear infinite;
  background: transparent;
  width: 18px;
  height: 18px;
  content: '';
  border-radius: 50%;
}
.code-languages__loading .code-languages-icon svg {
  display: none;
}
.code-languages__active:after {
  content: '';
  position: absolute;
  bottom: 0;
  height: 2px;
  width: 100%;
  background: var(--theme-color-1, var(--default-theme-color-1));
}
@keyframes codeloader {
  0% {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(1turn);
  }
}
.code-languages span {
  margin-top: 6px;
  color: var(--theme-color-2, var(--default-theme-color-2));
  font-size: var(--theme-micro, var(--default-theme-micro));
}
.code-languages__active span {
  color: var(--theme-color-1, var(--default-theme-color-1));
}
.code-languages__select select {
  opacity: 0;
  width: 100%;
  aspect-ratio: 1;
  position: absolute;
  top: 0;
  left: 0;
  cursor: pointer;
  z-index: 1;
  -moz-appearance: none;
  -webkit-appearance: none;
  appearance: none;
}
.code-languages__select span {
  position: relative;
  display: flex;
  align-items: center;
}
.code-languages__select span:after {
  content: '';
  width: 8px;
  height: 8px;
  background: var(--theme-background-1, var(--default-theme-background-1));
  box-shadow: 1px 1px 0 currentColor;
  display: block;
  transform: rotate(45deg);
  margin-left: 5px;
  margin-top: -7px;
}
.references-classic .code-languages {
  flex-direction: row;
  gap: 9px;
  max-width: initial;
  padding: 10px 0;
  font-weight: var(--theme-semibold, var(--default-theme-semibold));
}
.references-classic .code-languages span {
  margin-top: 0;
}
.references-classic .code-languages-icon {
  width: 24px;
  padding: 3px;
}
.references-classic .code-languages-background {
  border-radius: var(--theme-radius, var(--default-theme-radius));
}
</style>
