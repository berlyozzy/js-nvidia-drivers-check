<script>
    import Lists from './lib/device-ids'
    import { get_driver_link } from './lib/nvidia-utils'

    let card_name = "";
    let driver_url = "";
    let is_loading = false;

    const {
        gpu : pfids
    } = Lists;

    const find_card = async () => {
        is_loading = true;

        const pfid = Object.keys(pfids.desktop).includes(card_name.trim()) ? pfids.desktop[card_name.trim()] :
        Object.keys(pfids.notebook).includes(card_name.trim()) ? pfids.notebook[card_name.trim()] : "755"

        driver_url = (await get_driver_link({pfid})).url

        console.log({
            card_name,
            driver_url,
        })
    }


</script>

<main>

    <div class="user-input">
        
        <input placeholder="GeForce RTX 2080 SUPER" bind:value={card_name}/>
        <button class:inactive={card_name == ""} on:click={find_card}>Find</button>
        <span class="user-input-disclaimer">*Case Sensitive</span>

        <div class="user-input-result">
            <a href="https://www.nvidia.com/Download/{driver_url}" target="_blank" rel="noopener noreferrer">{driver_url}</a>
        </div>
       
    </div>

    <div>
        <img draggable="false" src="undraw_cat.svg" alt="Cat"/>
    </div>

    
    <footer>
        <a href="https://www.flaticon.com/free-icons/gpu" title="gpu icons" target="_blank" rel="noopener noreferrer">Gpu icons created by Smashicons - Flaticon</a>
        <a href="https://undraw.co/" title="cat" target="_blank" rel="noopener noreferrer">Cat picture created by unDraw</a>
    </footer>

</main>

<style>
    main{
        height: 100%;
        display: grid;
        grid-template-rows: repeat(2, 1fr);
        place-items: center;
    }

    input{
        height: 2rem;
        width: 15rem;
    }

    button{
        height: 2rem;
        aspect-ratio: 16/9;
    }

    button.inactive{
        opacity: 0.5;
        pointer-events: none;
        user-select: none;
    }

    .user-input{
        display: grid;
        grid-template-columns: max-content auto;
        gap: 0.25em;
    }

    .user-input-result, .user-input-disclaimer{
        grid-column-start: 1;
        grid-column-end: 3;
    }

    .user-input-result{
        height: 2.5rem;
        padding-top: 0.25em;
        transition: all 0.15s ease-in-out;
    }

    .user-input-disclaimer{
        font-size: 0.8em;
    }

    footer{
        display: grid;
        width: 100%;
        padding-left: 0.5em;
        padding-bottom: 1em;
        font-size: 0.8em;
    }
</style>