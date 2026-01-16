# 대구농아청년회 홈페이지 운영 메모 (간단 버전)

관리자 로그인 없이 파일만 교체/수정하면 바로 반영됩니다.

## 갤러리 사진 교체
- 경로: `assets/uploads/`
- 데이터: `assets/data/gallery.json`
- `image`에 업로드한 파일 경로, `title`/`caption`만 수정하면 카드가 자동 갱신됩니다.

## 행사 일정 수정
- 데이터: `assets/data/events.json`
- `title`, `datetime`, `location`, `category`만 변경/추가하면 행사 카드가 갱신됩니다.

## 소식/공지 수정
- 데이터: `assets/data/news.json`
- `title`, `type(공지/후기 등)`, `author`, `date(YYYY-MM-DD)`, `summary`를 채우면 카드와 리스트가 갱신됩니다.

## 캘린더 연동
- 파일: `index.html`
- `iframe`의 `src`를 실제 공개 캘린더 링크로 바꾸면 “캘린더로 보기 +”에서 표시됩니다.

## 문의 메일 수신처
- 파일: `script.js`
- `targetEmail` 값을 실제 수신 이메일로 교체하세요.

## 갤러리/행사/소식 더보기 토글
- “더보기/접기” 버튼은 자동 동작합니다. 토글이 안 되면 `script.js`가 로드되는지 확인하세요.
