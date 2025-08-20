<script setup lang="ts">
import {useI18n} from "vue-i18n";
import {notice} from "@/infoHud/notice/notice.ts";

const i18n = useI18n();

type LangData = {[key: string]: string | LangData};

window.ayuScriptApi = {
  addon: {
    mergeI18n: (lang: string, langData: LangData) => {
      i18n.mergeLocaleMessage(lang, langData);
    },
    notice: (content: string) => {
      notice(content);
    }
  }
}
</script>